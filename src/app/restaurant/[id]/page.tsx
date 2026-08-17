"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import CustomerShell from "@/components/layout/CustomerShell";
import FoodItemCard from "@/components/customer/FoodItemCard";
import StatusBadge from "@/components/ui/StatusBadge";
import RatingBadge from "@/components/ui/RatingBadge";

import {
  restaurantService,
} from "@/lib/services/restaurant.service";

import {
  menuService,
} from "@/lib/services/menu.service";

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();

  const [restaurant, setRestaurant] =
    useState<any>(null);

  const [menu, setMenu] = useState<any[]>([]);
  const [active, setActive] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRestaurant() {
      try {
        setLoading(true);
        setError("");

        const [
          restaurantData,
          menuData,
        ] = await Promise.all([
          restaurantService.get(),
          menuService.listByRestaurant(params.id),
        ]);

        setRestaurant(restaurantData);

        const categories = menuData ?? [];

        setMenu(categories);

        if (categories.length > 0) {
          setActive(
            categories[0]._id ??
              categories[0].id ??
              categories[0].name
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load restaurant."
        );
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadRestaurant();
    }
  }, [params.id]);

  if (loading) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          <div className="card-kitchen h-80 animate-pulse" />
        </div>
      </CustomerShell>
    );
  }

  if (error) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          <div className="card-kitchen p-10 text-center">
            <h2 className="font-extrabold">
              Unable to load restaurant
            </h2>

            <p className="mt-2 text-[#6d625a]">
              {error}
            </p>
          </div>
        </div>
      </CustomerShell>
    );
  }

  if (!restaurant) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          <div className="card-kitchen p-10 text-center">
            <h2 className="font-extrabold">
              Restaurant not found
            </h2>
          </div>
        </div>
      </CustomerShell>
    );
  }

  const activeCategory = menu.find(
    (category: any) =>
      (category._id ??
        category.id ??
        category.name) === active
  );

  const items = activeCategory?.items ?? [];

  return (
    <CustomerShell>
      <div className="container-kitchen py-8">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-60 w-full object-cover sm:h-80"
          />

          <div className="p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black text-[#6b4f3a]">
                    {restaurant.name}
                  </h1>

                  <StatusBadge
                    status=""
                    open={restaurant.isOpen}
                  />
                </div>

                <p className="mt-2 text-[#6d625a]">
                  {restaurant.cuisine} •{" "}
                  {restaurant.distanceKm} km •{" "}
                  {restaurant.deliveryMinutes} min
                </p>

                <p className="mt-2 text-sm text-[#6d625a]">
                  {restaurant.description}
                </p>
              </div>

              <RatingBadge
                rating={restaurant.rating}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#6d625a]">
              <span>{restaurant.address}</span>

              <span>•</span>

              <span>{restaurant.hours}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {menu.map((category: any) => {
            const categoryId =
              category._id ??
              category.id ??
              category.name;

            return (
              <button
                key={categoryId}
                onClick={() =>
                  setActive(categoryId)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
                  active === categoryId
                    ? "bg-[#e4572e] text-white"
                    : "border bg-white text-[#6b4f3a]"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-4">
          {items.map((item: any) => (
            <FoodItemCard
              key={item._id ?? item.id}
              item={item}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="card-kitchen mt-5 p-10 text-center">
            <h2 className="font-extrabold">
              No food available
            </h2>

            <p className="mt-2 text-[#6d625a]">
              This category currently has no available
              items.
            </p>
          </div>
        )}

        <Link
          href="/cart"
          className="btn-primary mt-7 inline-flex"
        >
          View cart
        </Link>
      </div>
    </CustomerShell>
  );
}
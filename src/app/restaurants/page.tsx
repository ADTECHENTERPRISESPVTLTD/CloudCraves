"use client";

import { useEffect, useMemo, useState } from "react";

import CustomerShell from "@/components/layout/CustomerShell";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { restaurantService } from "@/lib/services/restaurant.service";

export default function RestaurantsPage() {
  const [restaurant, setRestaurant] = useState<any>(null);

  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [openOnly, setOpenOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRestaurant() {
      try {
        setLoading(true);
        setError("");

        const data = await restaurantService.get();

        setRestaurant(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load restaurants."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, []);

  const cuisines = useMemo(() => {
    if (!restaurant?.cuisine) {
      return ["All"];
    }

    return ["All", restaurant.cuisine];
  }, [restaurant]);

  const data = useMemo(() => {
    if (!restaurant) {
      return [];
    }

    const matchesSearch =
      !q ||
      `${restaurant.name ?? ""} ${
        restaurant.cuisine ?? ""
      }`
        .toLowerCase()
        .includes(q.toLowerCase());

    const matchesCuisine =
      cuisine === "All" ||
      restaurant.cuisine === cuisine;

    const matchesOpen =
      !openOnly || restaurant.isOpen;

    return matchesSearch &&
      matchesCuisine &&
      matchesOpen
      ? [restaurant]
      : [];
  }, [restaurant, q, cuisine, openOnly]);

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <h1 className="text-4xl font-black text-[#6b4f3a]">
          Find local restaurants
        </h1>

        <p className="mt-2 text-[#6d625a]">
          Browse nearby kitchens by cuisine, rating and
          delivery.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            className="input-kitchen"
            placeholder="Search restaurant or cuisine"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="input-kitchen"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            {cuisines.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <button
            onClick={() => setOpenOnly((value) => !value)}
            className={
              openOnly
                ? "btn-primary"
                : "btn-secondary"
            }
          >
            {openOnly
              ? "Open only ✓"
              : "Show open only"}
          </button>
        </div>

        {loading && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="card-kitchen h-72 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="card-kitchen mt-8 p-10 text-center">
            <h2 className="font-extrabold">
              Failed to load restaurants
            </h2>

            <p className="mt-2 text-[#6d625a]">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <RestaurantCard
                key={item._id ?? item.id}
                restaurant={item}
              />
            ))}
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="card-kitchen mt-8 p-10 text-center">
            <h2 className="font-extrabold">
              No nearby restaurants found
            </h2>

            <p className="mt-2 text-[#6d625a]">
              Try another cuisine or search term.
            </p>
          </div>
        )}
      </div>
    </CustomerShell>
  );
}
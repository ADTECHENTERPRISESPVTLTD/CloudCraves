import Link from "next/link";
import {
  Clock3,
  MapPin,
  Star,
  ArrowUpRight,
} from "lucide-react";
import type { Restaurant } from "@/types/restaurant";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({
  restaurant,
}: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="restaurant-card group"
    >
      <div className="restaurant-card-image">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          loading="lazy"
        />

        <div className="absolute left-3 top-3">
          {restaurant.isOpen ? (
            <span className="status-open">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5c8d47]" />
              Open now
            </span>
          ) : (
            <span className="status-closed">
              Closed
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-black text-[#6b4f3a] shadow-sm backdrop-blur">
          <Star
            size={13}
            className="fill-[#f28c28] text-[#f28c28]"
          />
          {restaurant.rating}
        </div>
      </div>

      <div className="restaurant-card-body">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-black text-[#6b4f3a]">
              {restaurant.name}
            </h3>

            <p className="mt-1 truncate text-sm text-[#6d625a]">
              {restaurant.cuisine}
            </p>
          </div>

          <ArrowUpRight
            size={18}
            className="shrink-0 text-[#b6aaa1] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e4572e]"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#6d625a]">
          <span className="flex items-center gap-1">
            <Clock3 size={14} />
            {restaurant.deliveryMinutes} min
          </span>

          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {restaurant.distanceKm} km
          </span>
        </div>

        <div className="mt-4 border-t border-[#eee4dc] pt-3">
          <span
            className={
              restaurant.deliveryAvailable
                ? "text-xs font-extrabold text-[#5c8d47]"
                : "text-xs font-extrabold text-[#6d625a]"
            }
          >
            {restaurant.deliveryAvailable
              ? "✓ Home delivery available"
              : "Pickup available"}
          </span>
        </div>
      </div>
    </Link>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import CustomerShell from "@/components/layout/CustomerShell";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { restaurantService } from "@/lib/services/restaurant.service";
import type { Restaurant } from "@/types/restaurant";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [openOnly, setOpenOnly] = useState(false);

  useEffect(() => {
    restaurantService
      .list()
      .then((data) => {
        setRestaurants(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load restaurants.");
      })
      .finally(() => setLoading(false));
  }, []);

  const cuisines = useMemo(() => {
    return ["All", ...Array.from(new Set(restaurants.map((r) => r.cuisine)))];
  }, [restaurants]);

  const filteredData = useMemo(() => {
    return restaurants.filter(
      (r) =>
        (!q || `${r.name} ${r.cuisine}`.toLowerCase().includes(q.toLowerCase())) &&
        (cuisine === "All" || r.cuisine === cuisine) &&
        (!openOnly || r.isOpen)
    );
  }, [restaurants, q, cuisine, openOnly]);

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <h1 className="text-4xl font-black text-[#6b4f3a]">Find local restaurants</h1>
        <p className="mt-2 text-[#6d625a]">
          Browse nearby kitchens by cuisine, rating and delivery.
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
            {cuisines.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>

          <button
            onClick={() => setOpenOnly(!openOnly)}
            className={openOnly ? "btn-primary" : "btn-secondary"}
          >
            {openOnly ? "Open only ✓" : "Show open only"}
          </button>
        </div>

        {loading && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-kitchen h-72 animate-pulse bg-[#f3f1ec]" />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl bg-[#f8e6e1] p-4 text-[#b33b21] font-semibold">
            {error}
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="card-kitchen mt-8 p-10 text-center">
            <h2 className="font-extrabold">No nearby restaurants found</h2>
            <p className="mt-2 text-[#6d625a]">Try another cuisine or search term.</p>
          </div>
        )}

        {!loading && !error && filteredData.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </div>
    </CustomerShell>
  );
}

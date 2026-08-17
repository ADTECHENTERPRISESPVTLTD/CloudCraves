"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import CustomerShell from "@/components/layout/CustomerShell";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  EmptyState,
  ErrorState,
} from "@/components/ui/StatePanels";

import { orderService } from "@/lib/services/order.service";
import type { Order } from "@/types/order";
import { money } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderService
      .list()
      .then(setOrders)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load orders."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <h1 className="text-4xl font-black text-[#6b4f3a]">
          My Orders
        </h1>

        <div className="mt-7">
          {loading && (
            <div className="animate-pulse rounded-2xl bg-[#f3f1ec] p-8">
              Loading orders...
            </div>
          )}

          {!loading && error && (
            <ErrorState text={error} />
          )}

          {!loading && !error && orders.length === 0 && (
            <EmptyState
              title="No orders yet"
              text="Your completed orders will appear here."
            />
          )}

          {!loading &&
            !error &&
            orders.map((order) => (
              <Link
                href={`/orders/${order.id}`}
                key={order.id}
                className="card-kitchen mb-4 block p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <p className="font-black">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-sm text-[#6d625a]">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                    <p className="mt-2 text-sm">
                      {order.items.length} item(s)
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <StatusBadge
                      status={order.status}
                    />

                    <p className="mt-2 font-black">
                      {money(order.total)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </CustomerShell>
  );
}
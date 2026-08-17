"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import CustomerShell from "@/components/layout/CustomerShell";
import StatusBadge from "@/components/ui/StatusBadge";

import { orderService } from "@/lib/services/order.service";

import type { Order } from "@/types/order";

import { money } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await orderService.list();

        setOrders(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <h1 className="text-4xl font-black text-[#6b4f3a]">
          My Orders
        </h1>

        {loading && (
          <div className="mt-7 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-3xl bg-[#eee8df]"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-7 rounded-xl bg-[#f8e6e1] p-4 text-sm font-semibold text-[#b33b21]">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="card-kitchen mt-7 p-10 text-center">
              <h2 className="font-extrabold">
                No previous orders
              </h2>

              <p className="mt-2 text-sm text-[#6d625a]">
                Your completed orders will appear here.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="mt-7 space-y-4">
              {orders.map((order) => (
                <Link
                  href={`/orders/${
                    order.id || order.orderId
                  }`}
                  key={
                    order.id || order.orderId
                  }
                  className="card-kitchen block p-5 transition hover:shadow-lg"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <p className="text-xs font-bold text-[#6d625a]">
                        {order.orderId}
                      </p>

                      <h2 className="mt-1 text-lg font-extrabold">
                        CloudCraves Kitchen
                      </h2>

                      <p className="mt-1 text-sm text-[#6d625a]">
                        {order.items
                          .map(
                            (item) =>
                              `${item.name} × ${item.quantity}`
                          )
                          .join(", ")}
                      </p>

                      <p className="mt-2 text-xs text-[#8a7d72]">
                        {new Date(
                          order.createdAt
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge
                        status={order.orderStatus}
                      />

                      <b>
                        {money(
                          order.totalAmount
                        )}
                      </b>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </div>
    </CustomerShell>
  );
}
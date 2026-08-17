"use client";

import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import MetricCard from "@/components/admin/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockOrders } from "@/data/mockOrders";

import type { OrderStatus } from "@/types/order";

const activeStatuses: OrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
];

function getOrderNumber(order: (typeof mockOrders)[number]) {
  return (
    order.orderId ||
    order._id ||
    order.id ||
    "Order"
  );
}

function getCustomerName(
  order: (typeof mockOrders)[number]
) {
  return order.deliveryAddress?.name || "Customer";
}

function getRestaurantName(
  order: (typeof mockOrders)[number]
) {
  if (order.restaurantId === "r1") {
    return "Aai's Kitchen";
  }

  if (order.restaurantId === "r2") {
    return "Tadka Town";
  }

  return "CloudCraves Kitchen";
}

export default function AdminDashboard() {
  const pending = mockOrders.filter(
    (order) =>
      activeStatuses.includes(order.orderStatus)
  ).length;

  const totalRevenue = mockOrders.reduce(
    (sum, order) =>
      sum +
      (order.totalAmount ??
        order.subtotal +
          (order.deliveryCharge ?? 0) +
          (order.tax ?? 0) -
          (order.discount ?? 0)),
    0
  );

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-[#e4572e]">
          Today
        </p>

        <h1 className="mt-1 text-3xl font-black text-[#6b4f3a] sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-[#6d625a]">
          Monitor orders and kitchen activity.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Today's orders"
          value={String(mockOrders.length)}
          note="Current order list"
        />

        <MetricCard
          label="Revenue"
          value={`₹${totalRevenue}`}
          note="From current orders"
        />

        <MetricCard
          label="Pending orders"
          value={String(pending)}
          note="Needs attention"
        />

        <MetricCard
          label="Active menu items"
          value="18"
          note="2 unavailable"
        />
      </div>

      <section className="card-kitchen mt-6 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-[#6b4f3a]">
              Recent orders
            </h2>

            <p className="mt-1 text-sm text-[#6d625a]">
              Latest customer orders and their status.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="font-bold text-[#e4572e]"
          >
            View all →
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {mockOrders.length === 0 ? (
            <div className="rounded-xl bg-[#f3f1ec] p-6 text-center">
              <p className="font-black">
                No recent orders
              </p>

              <p className="mt-1 text-sm text-[#6d625a]">
                New orders will appear here.
              </p>
            </div>
          ) : (
            mockOrders.map((order) => (
              <div
                key={
                  order.id ||
                  order.orderId ||
                  order.createdAt
                }
                className="flex flex-col justify-between gap-3 rounded-xl bg-[#f3f1ec] p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={
                        order.id
                          ? `/admin/orders/${order.id}`
                          : "/admin/orders"
                      }
                      className="font-black text-[#6b4f3a] hover:text-[#e4572e]"
                    >
                      {getOrderNumber(order)}
                    </Link>

                    <span className="text-xs text-[#6d625a]">
                      •
                    </span>

                    <span className="text-sm font-semibold text-[#6d625a]">
                      {getRestaurantName(order)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[#6d625a]">
                    {getCustomerName(order)}{" "}
                    • {order.items.length} item
                    {order.items.length === 1
                      ? ""
                      : "s"}
                  </p>
                </div>

                <StatusBadge
                  status={order.orderStatus}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </AdminShell>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import MetricCard from "@/components/admin/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { orderService } from "@/lib/services/order.service";

import type { Order, OrderStatus } from "@/types/order";

const activeStatuses: OrderStatus[] = [
  "ACCEPTED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
];

function getOrderId(order: Order) {
  return order.id || order._id || order.orderId;
}

function getOrderNumber(order: Order) {
  return order.orderId || order._id || order.id || "Order";
}

function getTotal(order: Order) {
  return (
    order.totalAmount ??
    order.subtotal +
      (order.deliveryCharge ?? 0) +
      (order.tax ?? 0) -
      (order.discount ?? 0)
  );
}

function isToday(dateValue: string) {
  const date = new Date(dateValue);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const result = await orderService.listAdmin();
      setOrders(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const todayOrders = orders.filter((order) =>
      isToday(order.createdAt)
    );

    const revenue = todayOrders
      .filter((order) => order.paymentStatus === "PAID")
      .reduce(
        (total, order) => total + getTotal(order),
        0
      );

    const activeOrders = orders.filter((order) =>
      activeStatuses.includes(order.orderStatus)
    ).length;

    const recentOrders = [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      todayOrders: todayOrders.length,
      revenue,
      activeOrders,
      recentOrders,
    };
  }, [orders]);

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-[#e4572e]">
          Today
        </p>

        <h2 className="mt-1 text-3xl font-black text-[#6b4f3a]">
          Dashboard
        </h2>

        <p className="mt-2 text-sm text-[#6d625a]">
          Overview of your kitchen orders and operations.
        </p>
      </div>

      {error && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#f1c9c0] bg-[#fdf1ee] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#b33b21]">
            {error}
          </p>

          <button
            type="button"
            className="btn-secondary py-2"
            onClick={() => void loadDashboard()}
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Today's orders"
          value={loading ? "..." : String(metrics.todayOrders)}
          note="Orders created today"
        />

        <MetricCard
          label="Revenue"
          value={
            loading
              ? "..."
              : `₹${metrics.revenue.toLocaleString("en-IN")}`
          }
          note="Paid orders today"
        />

        <MetricCard
          label="Active orders"
          value={loading ? "..." : String(metrics.activeOrders)}
          note="Currently in progress"
        />

        <MetricCard
          label="Total orders"
          value={loading ? "..." : String(orders.length)}
          note="All orders"
        />
      </div>

      <section className="card-kitchen mt-6 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-black">
              Recent orders
            </h3>

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
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-[#f3f1ec]"
              />
            ))
          ) : metrics.recentOrders.length === 0 ? (
            <div className="rounded-xl bg-[#f3f1ec] p-6 text-center">
              <p className="font-black">
                No recent orders
              </p>

              <p className="mt-1 text-sm text-[#6d625a]">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            metrics.recentOrders.map((order) => {
              const orderId = getOrderId(order);

              return (
                <div
                  key={
                    orderId ||
                    `${order.orderStatus}-${order.createdAt}`
                  }
                  className="flex flex-col justify-between gap-3 rounded-xl bg-[#f3f1ec] p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <Link
                      href={
                        orderId
                          ? `/admin/orders/${orderId}`
                          : "/admin/orders"
                      }
                      className="font-black text-[#6b4f3a] hover:text-[#e4572e]"
                    >
                      #{getOrderNumber(order)}
                    </Link>

                    <p className="mt-1 text-sm text-[#6d625a]">
                      CloudCraves Kitchen • {order.items.length} item
                      {order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <StatusBadge status={order.orderStatus} />
                </div>
              );
            })
          )}
        </div>
      </section>
    </AdminShell>
  );
}
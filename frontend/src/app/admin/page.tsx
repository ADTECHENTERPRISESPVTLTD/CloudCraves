"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AdminShell from "@/components/admin/AdminShell";
import MetricCard from "@/components/admin/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";

import { adminService } from "@/lib/services/admin.service";

type DashboardData = {
  totalOrders?: number;
  totalRevenue?: number;
  pendingOrders?: number;
  totalCustomers?: number;
  activeFoodItems?: number;
};

export default function AdminDashboard() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminService.dashboard(),
      adminService.orders(),
    ])
      .then(([dashboard, ordersData]) => {
        setData(
          dashboard as DashboardData
        );

        setOrders(ordersData.slice(0, 5));
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminShell>
        <div className="animate-pulse rounded-2xl bg-[#f3f1ec] p-10">
          Loading dashboard...
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell>
        <div className="rounded-xl bg-[#f8e6e1] p-4 text-[#b33b21]">
          {error}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-bold text-[#e4572e]">
          TODAY
        </p>

        <h2 className="text-3xl font-black text-[#6b4f3a]">
          Dashboard
        </h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Orders"
          value={String(
            data?.totalOrders ?? 0
          )}
          note="Backend data"
        />

        <MetricCard
          label="Revenue"
          value={`₹${data?.totalRevenue ?? 0}`}
          note="Backend data"
        />

        <MetricCard
          label="Pending orders"
          value={String(
            data?.pendingOrders ?? 0
          )}
          note="Needs attention"
        />

        <MetricCard
          label="Customers"
          value={String(
            data?.totalCustomers ?? 0
          )}
          note="Registered customers"
        />
      </div>

      <section className="card-kitchen mt-6 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black">
            Recent orders
          </h3>

          <Link
            href="/admin/orders"
            className="font-bold text-[#e4572e]"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/admin/orders/${order._id}`}
              className="flex flex-col justify-between gap-2 rounded-xl bg-[#f3f1ec] p-4 sm:flex-row"
            >
              <div>
                <b>{order.orderId}</b>

                <p className="text-sm text-[#6d625a]">
                  {order.userId?.name ||
                    "Customer"}
                </p>
              </div>

              <StatusBadge
                status={String(
                  order.orderStatus
                ).toLowerCase()}
              />
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
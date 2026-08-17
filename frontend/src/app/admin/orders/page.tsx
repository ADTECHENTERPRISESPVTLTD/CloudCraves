"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/ui/StatusBadge";

import {
  adminService,
  type AdminOrder,
} from "@/lib/services/admin.service";

export default function AdminOrders() {
  const [orders, setOrders] = useState<
    AdminOrder[]
  >([]);

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    adminService
      .orders()
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

  const data = orders.filter(
    (order) =>
      filter === "all" ||
      order.orderStatus === filter
  );

  return (
    <AdminShell>
      <h2 className="text-3xl font-black text-[#6b4f3a]">
        Orders
      </h2>

      <div className="mt-5">
        <select
          className="input-kitchen max-w-xs"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="all">
            All statuses
          </option>

          {[
            "PLACED",
            "ACCEPTED",
            "PREPARING",
            "READY",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
          ].map((status) => (
            <option
              key={status}
              value={status}
            >
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="mt-5 animate-pulse rounded-2xl bg-[#f3f1ec] p-10">
          Loading orders...
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl bg-[#f8e6e1] p-4 text-[#b33b21]">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        data.length === 0 && (
          <div className="card-kitchen mt-5 p-10 text-center">
            No orders found.
          </div>
        )}

      {!loading &&
        !error &&
        data.length > 0 && (
          <div className="card-kitchen mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#f3f1ec]">
                <tr>
                  <th className="p-4">
                    Order
                  </th>

                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t"
                  >
                    <td className="p-4 font-bold">
                      {order.orderId}
                    </td>

                    <td>
                      {order.userId?.name ||
                        order.deliveryAddress
                          .name}
                    </td>

                    <td>
                      ₹{order.totalAmount}
                    </td>

                    <td>
                      <StatusBadge
                        status={order.orderStatus.toLowerCase()}
                      />
                    </td>

                    <td>
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="btn-secondary inline-block py-2"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </AdminShell>
  );
}
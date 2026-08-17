"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/ui/StatusBadge";
import { orderService } from "@/lib/services/order.service";

import type { Order, OrderStatus } from "@/types/order";

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  PLACED: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
  READY: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

const statusLabels: Record<OrderStatus, string> = {
  PLACED: "Placed",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const actionLabels: Partial<Record<OrderStatus, string>> = {
  PLACED: "Accept",
  ACCEPTED: "Prepare",
  PREPARING: "Mark ready",
  READY: "Dispatch",
  OUT_FOR_DELIVERY: "Complete",
};

function getOrderId(order: Order) {
  return order.id || order._id || order.orderId;
}

function getOrderNumber(order: Order) {
  return order.orderId || order._id || order.id || "Order";
}

function getCustomerName(order: Order) {
  return order.deliveryAddress?.name || "Customer";
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

function getRestaurantName(order: Order) {
  if (order.restaurantId === "r1") {
    return "Aai's Kitchen";
  }

  if (order.restaurantId === "r2") {
    return "Tadka Town";
  }

  return "CloudCraves Kitchen";
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const result = await orderService.listAdmin();

      setOrders(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const data = useMemo(() => {
    return orders.filter(
      (order) =>
        filter === "ALL" || order.orderStatus === filter
    );
  }, [orders, filter]);

  async function updateOrderStatus(order: Order) {
    const orderId = getOrderId(order);

    if (!orderId) {
      return;
    }

    const newStatus = nextStatus[order.orderStatus];

    if (!newStatus) {
      return;
    }

    try {
      setUpdatingId(orderId);
      setError("");

      const updatedOrder = await orderService.updateStatus(
        orderId,
        newStatus
      );

      setOrders((currentOrders) =>
        currentOrders.map((item) => {
          const itemId = getOrderId(item);

          return itemId === orderId ? updatedOrder : item;
        })
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the order status."
      );
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-[#e4572e]">
          Order management
        </p>

        <h1 className="mt-1 text-3xl font-black text-[#6b4f3a] sm:text-4xl">
          Orders
        </h1>

        <p className="mt-2 text-sm text-[#6d625a]">
          View and manage customer orders from one place.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select
          className="input-kitchen w-full max-w-xs"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as "ALL" | OrderStatus)
          }
          disabled={loading}
        >
          <option value="ALL">All statuses</option>

          {(
            [
              "PLACED",
              "ACCEPTED",
              "PREPARING",
              "READY",
              "OUT_FOR_DELIVERY",
              "DELIVERED",
              "CANCELLED",
            ] as OrderStatus[]
          ).map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>

        <p className="text-sm font-semibold text-[#6d625a]">
          {data.length} order{data.length === 1 ? "" : "s"}
        </p>
      </div>

      {error && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#f1c9c0] bg-[#fdf1ee] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#b33b21]">
            {error}
          </p>

          <button
            type="button"
            className="btn-secondary py-2"
            onClick={() => void loadOrders()}
          >
            Try again
          </button>
        </div>
      )}

      <div className="card-kitchen mt-5 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-[#f3f1ec]"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#f3f1ec]">
                <tr>
                  <th className="p-4 font-black">Order</th>
                  <th className="p-4 font-black">Restaurant</th>
                  <th className="p-4 font-black">Customer</th>
                  <th className="p-4 font-black">Items</th>
                  <th className="p-4 font-black">Total</th>
                  <th className="p-4 font-black">Status</th>
                  <th className="p-4 font-black">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <div className="font-black text-[#6b4f3a]">
                        No orders found
                      </div>

                      <p className="mt-1 text-sm text-[#6d625a]">
                        {filter === "ALL"
                          ? "New customer orders will appear here."
                          : "Try selecting another status."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  data.map((order) => {
                    const orderId = getOrderId(order);
                    const next = nextStatus[order.orderStatus];

                    return (
                      <tr
                        key={
                          orderId ||
                          `${order.orderStatus}-${order.createdAt}`
                        }
                        className="border-t border-[#eee8df]"
                      >
                        <td className="p-4">
                          <Link
                            href={
                              orderId
                                ? `/admin/orders/${orderId}`
                                : "/admin/orders"
                            }
                            className="font-black text-[#6b4f3a] hover:text-[#e4572e]"
                          >
                            {getOrderNumber(order)}
                          </Link>

                          <p className="mt-1 text-xs text-[#6d625a]">
                            {new Date(
                              order.createdAt
                            ).toLocaleString()}
                          </p>
                        </td>

                        <td className="p-4">
                          <span className="font-semibold">
                            {getRestaurantName(order)}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-semibold">
                            {getCustomerName(order)}
                          </span>

                          {order.deliveryAddress?.phone && (
                            <p className="mt-1 text-xs text-[#6d625a]">
                              {order.deliveryAddress.phone}
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          {order.items.length}
                        </td>

                        <td className="p-4 font-black">
                          ₹{getTotal(order)}
                        </td>

                        <td className="p-4">
                          <StatusBadge
                            status={order.orderStatus}
                          />
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={
                                orderId
                                  ? `/admin/orders/${orderId}`
                                  : "/admin/orders"
                              }
                              className="btn-secondary py-2"
                            >
                              Details
                            </Link>

                            {next ? (
                              <button
                                type="button"
                                className="btn-secondary py-2 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={
                                  !orderId ||
                                  updatingId === orderId
                                }
                                onClick={() =>
                                  void updateOrderStatus(order)
                                }
                              >
                                {updatingId === orderId
                                  ? "Updating..."
                                  : actionLabels[
                                      order.orderStatus
                                    ]}
                              </button>
                            ) : (
                              <span className="px-2 py-2 text-xs font-semibold text-[#6d625a]">
                                Read-only
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
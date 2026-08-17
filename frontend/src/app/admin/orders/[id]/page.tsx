"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

const actionLabels: Partial<Record<OrderStatus, string>> = {
  PLACED: "Accept order",
  ACCEPTED: "Start preparing",
  PREPARING: "Mark as ready",
  READY: "Dispatch for delivery",
  OUT_FOR_DELIVERY: "Mark as delivered",
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

function getTotal(order: Order) {
  return (
    order.totalAmount ??
    order.subtotal +
      (order.deliveryCharge ?? 0) +
      (order.tax ?? 0) -
      (order.discount ?? 0)
  );
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminOrderDetails() {
  const params = useParams();
  const rawId = params?.id;

  const orderId =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
        ? rawId[0]
        : "";

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState<
    "status" | "cancel" | ""
  >("");

  async function loadOrder() {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await orderService.getAdminById(orderId);

      setOrder(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load this order."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrder();
  }, [orderId]);

  async function handleNextStatus() {
    if (!order) return;

    const next = nextStatus[order.orderStatus];

    if (!next) return;

    const currentId = order.id || order._id || order.orderId;

    if (!currentId) {
      setError("Unable to identify this order.");
      return;
    }

    try {
      setActionLoading("status");
      setError("");

      const updatedOrder = await orderService.updateStatus(
        currentId,
        next
      );

      setOrder(updatedOrder);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the order status."
      );
    } finally {
      setActionLoading("");
    }
  }

  async function handleCancel() {
    if (!order) return;

    if (
      order.orderStatus === "DELIVERED" ||
      order.orderStatus === "CANCELLED"
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    const currentId = order.id || order._id || order.orderId;

    if (!currentId) {
      setError("Unable to identify this order.");
      return;
    }

    try {
      setActionLoading("cancel");
      setError("");

      const updatedOrder = await orderService.cancel(currentId);

      setOrder(updatedOrder);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel the order."
      );
    } finally {
      setActionLoading("");
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm font-bold text-[#e4572e]"
          >
            ← Back to orders
          </Link>

          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-[#e4572e]">
            Order details
          </p>

          <h1 className="mt-1 text-3xl font-black text-[#6b4f3a] sm:text-4xl">
            {loading
              ? "Loading order..."
              : order?.orderId || "Order"}
          </h1>

          {!loading && order && (
            <p className="mt-2 text-sm text-[#6d625a]">
              Created {formatDate(order.createdAt)}
            </p>
          )}
        </div>

        {!loading && order && (
          <StatusBadge status={order.orderStatus} />
        )}
      </div>

      {error && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#f1c9c0] bg-[#fdf1ee] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#b33b21]">
            {error}
          </p>

          {!order && (
            <button
              type="button"
              className="btn-secondary py-2"
              onClick={() => void loadOrder()}
            >
              Try again
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-5">
          <div className="h-32 animate-pulse rounded-2xl bg-[#f3f1ec]" />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-2xl bg-[#f3f1ec]" />
            <div className="h-72 animate-pulse rounded-2xl bg-[#f3f1ec]" />
          </div>

          <div className="h-80 animate-pulse rounded-2xl bg-[#f3f1ec]" />
        </div>
      ) : !order ? (
        <div className="card-kitchen mt-6 p-10 text-center">
          <h2 className="text-xl font-black text-[#6b4f3a]">
            Order not found
          </h2>

          <p className="mt-2 text-sm text-[#6d625a]">
            This order may have been deleted or the order ID is invalid.
          </p>

          <Link
            href="/admin/orders"
            className="btn-primary mt-5 inline-flex"
          >
            Back to orders
          </Link>
        </div>
      ) : (
        <>
          {/* Status and actions */}
          <section className="card-kitchen mt-6 p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#e4572e]">
                  Current status
                </p>

                <div className="mt-2">
                  <StatusBadge status={order.orderStatus} />
                </div>

                <p className="mt-3 text-sm text-[#6d625a]">
                  {statusLabels[order.orderStatus]}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {nextStatus[order.orderStatus] && (
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={actionLoading !== ""}
                    onClick={() => void handleNextStatus()}
                  >
                    {actionLoading === "status"
                      ? "Updating..."
                      : actionLabels[order.orderStatus]}
                  </button>
                )}

                {order.orderStatus !== "DELIVERED" &&
                  order.orderStatus !== "CANCELLED" && (
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={actionLoading !== ""}
                      onClick={() => void handleCancel()}
                    >
                      {actionLoading === "cancel"
                        ? "Cancelling..."
                        : "Cancel order"}
                    </button>
                  )}
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              {/* Ordered Items */}
              <section className="card-kitchen p-5">
                <h2 className="text-xl font-black text-[#6b4f3a]">
                  Ordered items
                </h2>

                <div className="mt-5 space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.foodId}-${index}`}
                      className="flex items-start justify-between gap-4 border-b border-[#eee8df] pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-black text-[#6b4f3a]">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#6d625a]">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-black">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {order.specialInstructions && (
                  <div className="mt-5 rounded-xl bg-[#f3f1ec] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                      Special instructions
                    </p>

                    <p className="mt-2 text-sm">
                      {order.specialInstructions}
                    </p>
                  </div>
                )}
              </section>

              {/* Customer & delivery */}
              <section className="card-kitchen p-5">
                <h2 className="text-xl font-black text-[#6b4f3a]">
                  Customer & delivery
                </h2>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                      Customer
                    </p>

                    <p className="mt-2 font-black text-[#6b4f3a]">
                      {order.deliveryAddress?.name || "Customer"}
                    </p>

                    <p className="mt-1 text-sm text-[#6d625a]">
                      {order.deliveryAddress?.phone || "Phone unavailable"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                      Delivery address
                    </p>

                    <div className="mt-2 space-y-1 text-sm text-[#6d625a]">
                      <p>
                        {order.deliveryAddress?.house}
                        {order.deliveryAddress?.street
                          ? `, ${order.deliveryAddress.street}`
                          : ""}
                      </p>

                      <p>
                        {order.deliveryAddress?.area}
                        {order.deliveryAddress?.village
                          ? `, ${order.deliveryAddress.village}`
                          : ""}
                      </p>

                      <p>
                        {order.deliveryAddress?.city},{" "}
                        {order.deliveryAddress?.state}{" "}
                        {order.deliveryAddress?.pincode}
                      </p>

                      {order.deliveryAddress?.landmark && (
                        <p>
                          Landmark:{" "}
                          {order.deliveryAddress.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              {/* Payment */}
              <section className="card-kitchen p-5">
                <h2 className="text-xl font-black text-[#6b4f3a]">
                  Payment
                </h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                      Payment method
                    </p>

                    <p className="mt-1 font-black">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                      Payment status
                    </p>

                    <p className="mt-1 font-black">
                      {order.paymentStatus}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                      Order type
                    </p>

                    <p className="mt-1 font-black">
                      {order.orderType}
                    </p>
                  </div>

                  {order.estimatedDeliveryTime && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                        Estimated delivery
                      </p>

                      <p className="mt-1 font-black">
                        {formatDate(order.estimatedDeliveryTime)}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Billing */}
              <section className="card-kitchen p-5">
                <h2 className="text-xl font-black text-[#6b4f3a]">
                  Billing summary
                </h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#6d625a]">Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#6d625a]">
                      Delivery charge
                    </span>
                    <span>₹{order.deliveryCharge ?? 0}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#6d625a]">Tax</span>
                    <span>₹{order.tax ?? 0}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#6d625a]">Discount</span>
                    <span>-₹{order.discount ?? 0}</span>
                  </div>

                  <div className="border-t border-[#eee8df] pt-4">
                    <div className="flex justify-between gap-4 text-lg">
                      <span className="font-black">Total</span>
                      <span className="font-black text-[#e4572e]">
                        ₹{getTotal(order)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order ID metadata */}
              <section className="card-kitchen p-5">
                <h2 className="text-xl font-black text-[#6b4f3a]">
                  Order ID information
                </h2>

                <div className="mt-5 space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                      Order ID
                    </p>
                    <p className="mt-1 break-all font-black">
                      {order.orderId}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                      Created
                    </p>
                    <p className="mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {order.updatedAt && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                        Last updated
                      </p>
                      <p className="mt-1">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
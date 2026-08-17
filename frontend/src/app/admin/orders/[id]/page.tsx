"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/ui/StatusBadge";

import {
  adminService,
  type AdminOrder,
} from "@/lib/services/admin.service";

const STATUS_OPTIONS = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const [order, setOrder] =
    useState<AdminOrder | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await adminService.order(id);
      setOrder(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Order not found."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function updateStatus(status: string) {
    setSaving(true);
    setError("");

    try {
      const updated =
        await adminService.updateOrderStatus(
          id,
          status
        );

      setOrder(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update order."
      );
    } finally {
      setSaving(false);
    }
  }

  async function cancelOrder() {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order?"
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      const updated =
        await adminService.cancelOrder(id);

      setOrder(updated as AdminOrder);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel order."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="animate-pulse rounded-2xl bg-[#f3f1ec] p-10">
          Loading order...
        </div>
      </AdminShell>
    );
  }

  if (!order) {
    return (
      <AdminShell>
        <div className="rounded-xl bg-[#f8e6e1] p-4 text-[#b33b21]">
          {error || "Order not found."}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <button
        onClick={() =>
          router.push("/admin/orders/")
        }
        className="mb-4 text-sm font-bold text-[#e4572e]"
      >
        ← Back to orders
      </button>

      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-sm font-bold text-[#e4572e]">
            ORDER DETAILS
          </p>

          <h2 className="text-3xl font-black text-[#6b4f3a]">
            {order.orderId}
          </h2>

          <p className="mt-1 text-sm text-[#6d625a]">
            {new Date(
              order.createdAt
            ).toLocaleString()}
          </p>
        </div>

        <StatusBadge
          status={order.orderStatus.toLowerCase()}
        />
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-[#f8e6e1] p-4 text-[#b33b21]">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card-kitchen p-5">
          <h3 className="text-xl font-black">
            Customer information
          </h3>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <b>Name:</b>{" "}
              {order.userId?.name ||
                order.deliveryAddress.name}
            </p>

            <p>
              <b>Phone:</b>{" "}
              {order.userId?.phone ||
                order.deliveryAddress.phone}
            </p>

            <p>
              <b>Email:</b>{" "}
              {order.userId?.email || "-"}
            </p>
          </div>
        </section>

        <section className="card-kitchen p-5">
          <h3 className="text-xl font-black">
            Delivery address
          </h3>

          <p className="mt-4 text-sm">
            {[
              order.deliveryAddress.house,
              order.deliveryAddress.street,
              order.deliveryAddress.area,
              order.deliveryAddress.village,
              order.deliveryAddress.city,
              order.deliveryAddress.state,
              order.deliveryAddress.pincode,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          {order.deliveryAddress.landmark && (
            <p className="mt-2 text-sm">
              <b>Landmark:</b>{" "}
              {order.deliveryAddress.landmark}
            </p>
          )}
        </section>
      </div>

      <section className="card-kitchen mt-6 p-5">
        <h3 className="text-xl font-black">
          Ordered items
        </h3>

        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div
              key={item.foodId}
              className="flex justify-between gap-4 rounded-xl bg-[#f3f1ec] p-4"
            >
              <div>
                <b>{item.name}</b>

                <p className="text-sm text-[#6d625a]">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="font-bold">
                ₹
                {item.price *
                  item.quantity}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-kitchen mt-6 p-5">
        <h3 className="text-xl font-black">
          Billing
        </h3>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            Subtotal: ₹{order.subtotal}
          </p>

          <p>
            Delivery: ₹
            {order.deliveryCharge}
          </p>

          <p>
            Discount: ₹{order.discount}
          </p>

          <p>
            Tax: ₹{order.tax}
          </p>

          <p className="text-xl font-black">
            Final total: ₹
            {order.totalAmount}
          </p>
        </div>
      </section>

      <section className="card-kitchen mt-6 p-5">
        <h3 className="text-xl font-black">
          Order actions
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              disabled={
                saving ||
                order.orderStatus === status
              }
              className="btn-secondary disabled:opacity-50"
              onClick={() =>
                updateStatus(status)
              }
            >
              {status.replaceAll("_", " ")}
            </button>
          ))}

          {order.orderStatus !==
            "CANCELLED" &&
            order.orderStatus !==
              "DELIVERED" && (
              <button
                disabled={saving}
                className="rounded-xl bg-[#b33b21] px-4 py-2 font-bold text-white"
                onClick={cancelOrder}
              >
                Reject / Cancel
              </button>
            )}
        </div>
      </section>
    </AdminShell>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import CustomerShell from "@/components/layout/CustomerShell";
import StatusBadge from "@/components/ui/StatusBadge";
import OrderStatusStepper from "@/components/customer/OrderStatusStepper";

import { orderService } from "@/lib/services/order.service";
import type { Order } from "@/types/order";

export default function OrderDetailsPage() {
  const params = useParams();
  const id = String(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await orderService.getById(id);
      setOrder(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load order."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    const timer = setInterval(() => {
      load();
    }, 10000);

    return () => clearInterval(timer);
  }, [id]);

  if (loading) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          <div className="animate-pulse rounded-2xl bg-[#f3f1ec] p-10">
            Loading order...
          </div>
        </div>
      </CustomerShell>
    );
  }

  if (error || !order) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          <div className="rounded-xl bg-[#f8e6e1] p-4 text-[#b33b21]">
            {error || "Order not found."}
          </div>
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-bold text-[#e4572e]">
              ORDER
            </p>

            <h1 className="text-3xl font-black text-[#6b4f3a]">
              {order.orderNumber}
            </h1>

            <p className="mt-1 text-sm text-[#6d625a]">
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>
          </div>

          <StatusBadge status={order.status} />
        </div>

        <section className="card-kitchen mt-6 p-5">
          <h2 className="text-xl font-black">
            Order tracking
          </h2>

          <div className="mt-5">
            <OrderStatusStepper
              status={order.status}
            />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="card-kitchen p-5">
            <h2 className="text-xl font-black">
              Items
            </h2>

            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 rounded-xl bg-[#f3f1ec] p-4"
                >
                  <div>
                    <b>{item.name}</b>
                    <p className="text-sm text-[#6d625a]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <b>
                    ₹
                    {item.price *
                      item.quantity}
                  </b>
                </div>
              ))}
            </div>
          </section>

          <section className="card-kitchen p-5">
            <h2 className="text-xl font-black">
              Delivery
            </h2>

            <p className="mt-4 text-sm">
              <b>Name:</b>{" "}
              {order.customerName}
            </p>

            <p className="mt-2 text-sm">
              <b>Phone:</b> {order.phone}
            </p>

            <p className="mt-2 text-sm">
              <b>Address:</b> {order.address}
            </p>

            {order.landmark && (
              <p className="mt-2 text-sm">
                <b>Landmark:</b>{" "}
                {order.landmark}
              </p>
            )}

            <hr className="my-5" />

            <p className="text-sm">
              <b>Subtotal:</b> ₹{order.subtotal}
            </p>

            <p className="mt-2 text-sm">
              <b>Delivery:</b> ₹
              {order.deliveryFee}
            </p>

            <p className="mt-3 text-lg font-black">
              Total: ₹{order.total}
            </p>
          </section>
        </div>
      </div>
    </CustomerShell>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import CustomerShell from "@/components/layout/CustomerShell";
import StatusBadge from "@/components/ui/StatusBadge";
import ReviewForm from "@/components/customer/ReviewForm";

import {
  orderService,
} from "@/lib/services/order.service";

import {
  reviewService,
} from "@/lib/services/review.service";

import type { Order } from "@/types/order";

import { money } from "@/lib/utils";

export default function OrderDetailsPage() {
  const params = useParams();

  const id = String(params.id);

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [reviewedFoodIds, setReviewedFoodIds] =
    useState<string[]>([]);

  const [reviewLoading, setReviewLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const data =
          await orderService.getById(id);

        setOrder(data);

        try {
          setReviewLoading(true);

          const reviews =
            await reviewService.listMyReviews();

          const existingFoodIds = reviews
            .filter(
              (review) =>
                String(review.orderId) ===
                String(data.id || data._id || data.orderId)
            )
            .map((review) =>
              String(review.foodId)
            );

          setReviewedFoodIds(existingFoodIds);
        } catch {
          /*
           * The order should still work even if
           * review history cannot be loaded.
           */
          setReviewedFoodIds([]);
        } finally {
          setReviewLoading(false);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function submitReview(
    foodId: string,
    data: {
      foodRating: number;
      serviceRating: number;
      comment: string;
    }
  ) {
    if (!order) {
      throw new Error("Order is unavailable.");
    }

    const orderId =
      order.id ||
      order._id ||
      order.orderId;

    if (!orderId) {
      throw new Error(
        "Order ID is unavailable."
      );
    }

    await reviewService.create({
      orderId: String(orderId),
      foodId: String(foodId),
      foodRating: data.foodRating,
      serviceRating: data.serviceRating,
      comment: data.comment,
    });

    setReviewedFoodIds((current) =>
      current.includes(String(foodId))
        ? current
        : [
            ...current,
            String(foodId),
          ]
    );
  }

  if (loading) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-10">
          <div className="h-10 w-60 animate-pulse rounded-xl bg-[#eee8df]" />

          <div className="mt-7 h-96 animate-pulse rounded-3xl bg-[#eee8df]" />
        </div>
      </CustomerShell>
    );
  }

  if (error || !order) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          <div className="card-kitchen p-8 text-center">
            <h2 className="text-xl font-black">
              Order not found
            </h2>

            <p className="mt-2 text-sm text-[#6d625a]">
              {error ||
                "This order could not be loaded."}
            </p>

            <Link
              href="/orders"
              className="btn-primary mt-5 inline-flex"
            >
              Back to orders
            </Link>
          </div>
        </div>
      </CustomerShell>
    );
  }

  const orderIdentifier =
    order.id ||
    order._id ||
    order.orderId;

  const canReview =
    order.orderStatus === "DELIVERED";

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <Link
          href="/orders"
          className="text-sm font-bold text-[#e4572e]"
        >
          ← Back to orders
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-[#6d625a]">
              {order.orderId}
            </p>

            <h1 className="mt-1 text-4xl font-black text-[#6b4f3a]">
              Order details
            </h1>
          </div>

          <StatusBadge
            status={order.orderStatus}
          />
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div className="card-kitchen p-6">
              <h2 className="text-xl font-black">
                Items
              </h2>

              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.foodId}
                    className="flex justify-between gap-4 border-b border-[#eadfd2] pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-bold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-[#6d625a]">
                        {item.quantity} ×{" "}
                        {money(item.price)}
                      </p>
                    </div>

                    <b>
                      {money(
                        item.price *
                          item.quantity
                      )}
                    </b>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-kitchen p-6">
              <h2 className="text-xl font-black">
                Delivery address
              </h2>

              <div className="mt-4 text-sm leading-6 text-[#6d625a]">
                <p className="font-bold text-[#3f342d]">
                  {order.deliveryAddress.name}
                </p>

                <p>
                  {order.deliveryAddress.house}
                </p>

                {order.deliveryAddress.street && (
                  <p>
                    {order.deliveryAddress.street}
                  </p>
                )}

                <p>
                  {order.deliveryAddress.area}
                </p>

                {order.deliveryAddress.village && (
                  <p>
                    {order.deliveryAddress.village}
                  </p>
                )}

                <p>
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state}
                </p>

                <p>
                  PIN:{" "}
                  {order.deliveryAddress.pincode}
                </p>

                {order.deliveryAddress.landmark && (
                  <p>
                    Landmark:{" "}
                    {
                      order.deliveryAddress
                        .landmark
                    }
                  </p>
                )}

                <p>
                  Phone:{" "}
                  {order.deliveryAddress.phone}
                </p>
              </div>
            </div>

            <div className="card-kitchen p-6">
              <h2 className="text-xl font-black">
                Order information
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase text-[#8a7d72]">
                    Order type
                  </p>

                  <p className="mt-1 font-bold">
                    {order.orderType}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-[#8a7d72]">
                    Payment
                  </p>

                  <p className="mt-1 font-bold">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-[#8a7d72]">
                    Payment status
                  </p>

                  <p className="mt-1 font-bold">
                    {order.paymentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-[#8a7d72]">
                    Estimated delivery
                  </p>

                  <p className="mt-1 font-bold">
                    {order.estimatedDeliveryTime ||
                      "30-45 mins"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-[#6b4f3a]">
                  Reviews
                </h2>

                <p className="mt-1 text-sm text-[#6d625a]">
                  Share your experience with
                  the items in this order.
                </p>
              </div>

              {!canReview && (
                <div className="card-kitchen p-5">
                  <p className="font-bold">
                    Review available after delivery
                  </p>

                  <p className="mt-1 text-sm text-[#6d625a]">
                    You can submit a review once
                    this order has been delivered.
                  </p>
                </div>
              )}

              {canReview && reviewLoading && (
                <div className="card-kitchen p-5">
                  <p className="text-sm font-semibold text-[#6d625a]">
                    Checking your submitted reviews...
                  </p>
                </div>
              )}

              {canReview &&
                !reviewLoading &&
                order.items.map((item) => {
                  const alreadyReviewed =
                    reviewedFoodIds.includes(
                      String(item.foodId)
                    );

                  return (
                    <div
                      key={`review-${item.foodId}`}
                    >
                      <div className="mb-3">
                        <p className="font-black">
                          {item.name}
                        </p>

                        <p className="text-sm text-[#6d625a]">
                          Rate this item and your
                          service experience.
                        </p>
                      </div>

                      {alreadyReviewed ? (
                        <div className="card-kitchen p-5">
                          <p className="font-bold text-[#5c8d47]">
                            ✓ Review already submitted
                          </p>

                          <p className="mt-1 text-sm text-[#6d625a]">
                            Thank you for sharing
                            your feedback for this
                            item.
                          </p>
                        </div>
                      ) : (
                        <ReviewForm
                          onSubmit={(data) =>
                            submitReview(
                              item.foodId,
                              data
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })}

              {canReview &&
                !reviewLoading &&
                order.items.length === 0 && (
                  <div className="card-kitchen p-5">
                    <p className="text-sm text-[#6d625a]">
                      No order items are available
                      for review.
                    </p>
                  </div>
                )}
            </div>
          </section>

          <aside className="card-kitchen h-fit p-6">
            <h2 className="text-xl font-black">
              Bill summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <b>
                  {money(order.subtotal)}
                </b>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>

                <b>
                  {money(
                    order.deliveryCharge
                  )}
                </b>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>

                <b>
                  {money(order.tax)}
                </b>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#5c8d47]">
                  <span>Discount</span>

                  <b>
                    -{money(
                      order.discount
                    )}
                  </b>
                </div>
              )}

              <div className="border-t border-[#eadfd2] pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-black">
                    Total
                  </span>

                  <b>
                    {money(
                      order.totalAmount
                    )}
                  </b>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#eadfd2] pt-4">
              <p className="text-xs text-[#8a7d72]">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-bold">
                {orderIdentifier}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </CustomerShell>
  );
}
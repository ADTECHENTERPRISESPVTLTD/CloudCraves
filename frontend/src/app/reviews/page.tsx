"use client";

import { useEffect, useState } from "react";

import CustomerShell from "@/components/layout/CustomerShell";
import {
  reviewService,
  type Review,
} from "@/lib/services/review.service";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    reviewService
      .listMine()
      .then(setReviews)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load reviews."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <h1 className="text-4xl font-black text-[#6b4f3a]">
          My Reviews
        </h1>

        {loading && (
          <div className="mt-6 animate-pulse rounded-2xl bg-[#f3f1ec] p-10">
            Loading reviews...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-[#f8e6e1] p-4 text-[#b33b21]">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          reviews.length === 0 && (
            <div className="card-kitchen mt-6 p-10 text-center">
              <h2 className="font-black">
                No reviews yet
              </h2>

              <p className="mt-2 text-sm text-[#6d625a]">
                Reviews from completed orders will
                appear here.
              </p>
            </div>
          )}

        <div className="mt-6 space-y-4">
          {reviews.map((review) => {
            const foodObj = review.foodId && typeof review.foodId === "object" ? (review.foodId as any) : null;
            const orderObj = review.orderId && typeof review.orderId === "object" ? (review.orderId as any) : null;

            return (
              <div
                key={review._id}
                className="card-kitchen p-5"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h2 className="font-black">
                      {foodObj?.name || "Food item"}
                    </h2>

                    <p className="mt-1 text-sm text-[#6d625a]">
                      Order:{" "}
                      {orderObj?.orderId || "-"}
                    </p>
                  </div>

                  <div className="text-sm font-bold">
                    Food: ⭐ {review.foodRating}
                    <br />
                    Service: ⭐{" "}
                    {review.serviceRating}
                  </div>
                </div>

                <p className="mt-4 text-sm">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </CustomerShell>
  );
}
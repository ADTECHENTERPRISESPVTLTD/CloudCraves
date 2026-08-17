"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

import {
  reviewService,
} from "@/lib/services/review.service";

import type {
  Review,
} from "@/types/review";

function Stars({
  value,
}: {
  value: number;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <Star
            key={star}
            size={18}
            className={
              star <= value
                ? "fill-[#f4c95d] text-[#f4c95d]"
                : "text-[#d7d0c8]"
            }
          />
        )
      )}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const data =
        await reviewService.listAdmin();

      setReviews(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-[#e4572e]">
          Customer feedback
        </p>

        <h1 className="mt-1 text-3xl font-black text-[#6b4f3a] sm:text-4xl">
          Reviews
        </h1>

        <p className="mt-2 text-sm text-[#6d625a]">
          View feedback submitted by your customers.
        </p>
      </div>

      {loading && (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="card-kitchen h-40 animate-pulse bg-[#eee8df]"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="card-kitchen mt-6 p-8 text-center">
          <h2 className="text-xl font-black">
            Unable to load reviews
          </h2>

          <p className="mt-2 text-sm text-[#6d625a]">
            {error}
          </p>

          <button
            type="button"
            onClick={loadReviews}
            className="btn-primary mt-5"
          >
            Try again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        reviews.length === 0 && (
          <div className="card-kitchen mt-6 p-10 text-center">
            <h2 className="text-xl font-black text-[#6b4f3a]">
              No reviews yet
            </h2>

            <p className="mt-2 text-sm text-[#6d625a]">
              Customer feedback will appear here once reviews are submitted.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        reviews.length > 0 && (
          <div className="mt-6 grid gap-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="card-kitchen p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-black text-[#6b4f3a]">
                        {review.customerName}
                      </h2>

                      {review.foodName && (
                        <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-bold text-[#e4572e]">
                          {review.foodName}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-[#6d625a]">
                      Order:{" "}
                      <Link
                        href={`/admin/orders/${review.orderId}`}
                        className="font-bold text-[#e4572e]"
                      >
                        {review.orderId}
                      </Link>
                    </p>
                  </div>

                  <p className="text-xs font-semibold text-[#8a7d72]">
                    {new Date(
                      review.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8a7d72]">
                      Food
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <Stars
                        value={review.foodRating}
                      />

                      <b>
                        {review.foodRating}/5
                      </b>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8a7d72]">
                      Service
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <Stars
                        value={review.serviceRating}
                      />

                      <b>
                        {review.serviceRating}/5
                      </b>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-[#f3f1ec] p-4">
                  <p className="text-sm leading-6 text-[#3f342d]">
                    {review.comment}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
    </AdminShell>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Mail,
  MessageSquare,
  Phone,
  ShoppingBag,
  Star,
  User,
  Utensils,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/StatePanels";

import { reviewService } from "@/lib/services/review.service";

type ReviewUser = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

type ReviewFood = {
  _id?: string;
  name?: string;
  image?: string;
  price?: number;
};

type ReviewOrder = {
  _id?: string;
  orderId?: string;
  createdAt?: string;
};

type AdminReview = {
  _id: string;

  userId?: ReviewUser | string | null;
  foodId?: ReviewFood | string | null;
  orderId?: ReviewOrder | string | null;

  foodRating: number;
  serviceRating: number;
  comment: string;

  createdAt: string;
  updatedAt?: string;
};

function getUser(review: AdminReview): ReviewUser | null {
  if (!review.userId || typeof review.userId === "string") {
    return null;
  }

  return review.userId;
}

function getFood(review: AdminReview): ReviewFood | null {
  if (!review.foodId || typeof review.foodId === "string") {
    return null;
  }

  return review.foodId;
}

function getOrder(review: AdminReview): ReviewOrder | null {
  if (!review.orderId || typeof review.orderId === "string") {
    return null;
  }

  return review.orderId;
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StarRating({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));

  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#6d625a]">
        {label}
      </p>

      <div
        className="flex items-center gap-1"
        aria-label={`${rating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={17}
            className={
              star <= rating
                ? "fill-[#f4c95d] text-[#f4c95d]"
                : "text-[#d8cec5]"
            }
          />
        ))}

        <span className="ml-1 text-sm font-extrabold text-[#6b4f3a]">
          {rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: AdminReview;
}) {
  const user = getUser(review);
  const food = getFood(review);
  const order = getOrder(review);

  const customerName =
    user?.name?.trim() || "Unknown customer";

  const customerEmail =
    user?.email?.trim() || "No email available";

  const customerPhone =
    user?.phone?.trim() || "No phone available";

  const foodName =
    food?.name?.trim() || "Unknown food item";

  const orderNumber =
    order?.orderId?.trim() || "Unknown order";

  return (
    <article className="card-kitchen overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#eadfd2] bg-[#fffaf5] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff1e8] text-[#e4572e]">
              <User size={22} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-black text-[#6b4f3a]">
                {customerName}
              </h3>

              <div className="mt-1 flex flex-col gap-1 text-sm text-[#6d625a]">
                <span className="flex items-center gap-2">
                  <Mail size={14} />
                  <span className="break-all">
                    {customerEmail}
                  </span>
                </span>

                <span className="flex items-center gap-2">
                  <Phone size={14} />
                  {customerPhone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#6d625a]">
            <CalendarDays size={14} />

            {formatDate(review.createdAt)}
          </div>
        </div>
      </div>

      {/* Review content */}
      <div className="p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
          <div>
            {/* Food */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f1ec] text-[#6b4f3a]">
                <Utensils size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                  Food item
                </p>

                <p className="mt-1 text-base font-extrabold text-[#2e2a27]">
                  {foodName}
                </p>
              </div>
            </div>

            {/* Order */}
            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f1ec] text-[#6b4f3a]">
                <ShoppingBag size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                  Order
                </p>

                <p className="mt-1 text-base font-extrabold text-[#2e2a27]">
                  {orderNumber}
                </p>
              </div>
            </div>

            {/* Comment */}
            <div className="mt-5 rounded-2xl bg-[#f3f1ec] p-4">
              <div className="flex items-start gap-3">
                <MessageSquare
                  size={18}
                  className="mt-0.5 shrink-0 text-[#e4572e]"
                />

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6d625a]">
                    Customer comment
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#2e2a27]">
                    {review.comment?.trim()
                      ? review.comment
                      : "No comment provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="min-w-[220px] rounded-2xl border border-[#eadfd2] bg-white p-4">
            <h4 className="mb-4 text-sm font-black uppercase tracking-wide text-[#6b4f3a]">
              Ratings
            </h4>

            <div className="space-y-4">
              <StarRating
                value={review.foodRating}
                label="Food rating"
              />

              <StarRating
                value={review.serviceRating}
                label="Service rating"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const data = await reviewService.listAdmin();

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  const averageFoodRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) =>
        sum + (Number(review.foodRating) || 0),
      0
    );

    return total / reviews.length;
  }, [reviews]);

  const averageServiceRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) =>
        sum + (Number(review.serviceRating) || 0),
      0
    );

    return total / reviews.length;
  }, [reviews]);

  return (
    <AdminShell>
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black text-[#6b4f3a]">
            Reviews
          </h2>

          <p className="mt-1 text-sm text-[#6d625a]">
            Customer feedback about food and service.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReviews}
          disabled={loading}
          className="btn-secondary w-full sm:w-auto"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5">
          <ErrorState text={error} />

          <button
            type="button"
            onClick={loadReviews}
            className="btn-primary mt-3"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="mt-5">
          <LoadingState label="Loading customer reviews…" />
        </div>
      )}

      {/* Loaded */}
      {!loading && !error && (
        <>
          {/* Summary */}
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="card-kitchen p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#6d625a]">
                    Total reviews
                  </p>

                  <p className="mt-1 text-3xl font-black text-[#6b4f3a]">
                    {reviews.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1e8] text-[#e4572e]">
                  <MessageSquare size={20} />
                </div>
              </div>
            </div>

            <div className="card-kitchen p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#6d625a]">
                    Average food rating
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-3xl font-black text-[#6b4f3a]">
                      {averageFoodRating.toFixed(1)}
                    </p>

                    <Star
                      size={22}
                      className="fill-[#f4c95d] text-[#f4c95d]"
                    />
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff8ee] text-[#f28c28]">
                  <Utensils size={20} />
                </div>
              </div>
            </div>

            <div className="card-kitchen p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#6d625a]">
                    Average service rating
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-3xl font-black text-[#6b4f3a]">
                      {averageServiceRating.toFixed(1)}
                    </p>

                    <Star
                      size={22}
                      className="fill-[#f4c95d] text-[#f4c95d]"
                    />
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f1ec] text-[#6b4f3a]">
                  <Star size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Empty */}
          {reviews.length === 0 && (
            <div className="mt-5">
              <EmptyState
                title="No reviews yet"
                text="Customer reviews will appear here after customers submit feedback for delivered orders."
              />
            </div>
          )}

          {/* Review list */}
          {reviews.length > 0 && (
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                />
              ))}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
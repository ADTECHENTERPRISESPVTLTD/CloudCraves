"use client";

import { useState } from "react";
import { reviewService } from "@/lib/services/review.service";

export default function ReviewForm({
  orderId,
  foodId,
}: {
  orderId: string;
  foodId: string;
}) {
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await reviewService.create({
        orderId,
        foodId,
        foodRating,
        serviceRating,
        comment,
      });

      setMessage("Review submitted successfully.");
      setComment("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit review"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-4 rounded-2xl bg-[#f3f1ec] p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold">
          Food rating

          <select
            className="input-kitchen mt-1"
            value={foodRating}
            onChange={(e) =>
              setFoodRating(Number(e.target.value))
            }
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating}/5
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-bold">
          Service rating

          <select
            className="input-kitchen mt-1"
            value={serviceRating}
            onChange={(e) =>
              setServiceRating(Number(e.target.value))
            }
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating}/5
              </option>
            ))}
          </select>
        </label>
      </div>

      <textarea
        className="input-kitchen mt-3 min-h-24"
        placeholder="Tell us about your experience"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-2 text-sm font-bold text-[#5c8d47]">
          {message}
        </p>
      )}

      <button
        disabled={loading}
        className="btn-primary mt-3"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
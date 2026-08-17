"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type ReviewData = {
  foodRating: number;
  serviceRating: number;
  comment: string;
};

type Props = {
  onSubmit: (
    data: ReviewData
  ) => Promise<void>;
};

type RatingSelectorProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function RatingSelector({
  label,
  value,
  onChange,
}: RatingSelectorProps) {
  return (
    <div className="mt-5">
      <p className="text-sm font-bold text-[#6b4f3a]">
        {label}
      </p>

      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map(
          (ratingValue) => (
            <button
              key={ratingValue}
              type="button"
              onClick={() =>
                onChange(ratingValue)
              }
              aria-label={`Rate ${label} ${ratingValue} stars`}
            >
              <Star
                size={30}
                className={
                  ratingValue <= value
                    ? "fill-[#f4c95d] text-[#f4c95d]"
                    : "text-[#d7d0c8]"
                }
              />
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default function ReviewForm({
  onSubmit,
}: Props) {
  const [foodRating, setFoodRating] =
    useState(0);

  const [
    serviceRating,
    setServiceRating,
  ] = useState(0);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      foodRating < 1 ||
      foodRating > 5
    ) {
      setError(
        "Please select a food rating."
      );
      return;
    }

    if (
      serviceRating < 1 ||
      serviceRating > 5
    ) {
      setError(
        "Please select a service rating."
      );
      return;
    }

    if (comment.trim().length < 5) {
      setError(
        "Please write at least 5 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        foodRating,
        serviceRating,
        comment: comment.trim(),
      });

      setSuccess(
        "Thank you! Your review was submitted."
      );

      setFoodRating(0);
      setServiceRating(0);
      setComment("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit your review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="card-kitchen p-5"
    >
      <h3 className="text-xl font-black">
        Rate your experience
      </h3>

      <RatingSelector
        label="Food rating"
        value={foodRating}
        onChange={setFoodRating}
      />

      <RatingSelector
        label="Service rating"
        value={serviceRating}
        onChange={setServiceRating}
      />

      <textarea
        className="input-kitchen mt-5 min-h-28"
        placeholder="Tell us about your food and experience..."
        value={comment}
        onChange={(event) =>
          setComment(event.target.value)
        }
      />

      {error && (
        <p className="mt-3 rounded-xl bg-[#f8e6e1] p-3 text-sm font-semibold text-[#b33b21]">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-3 rounded-xl bg-[#e8f3e3] p-3 text-sm font-semibold text-[#5c8d47]">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-4 disabled:opacity-60"
      >
        {loading
          ? "Submitting..."
          : "Submit review"}
      </button>
    </form>
  );
}
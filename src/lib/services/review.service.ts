import { apiFetch } from "@/lib/api/client";

import type {
  Review,
  ReviewInput,
} from "@/types/review";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

function normalizeReview(review: Review): Review {
  return {
    ...review,

    id:
      review.id ||
      review._id ||
      `${review.orderId}-${review.foodId}`,

    orderId: String(review.orderId),

    foodId: String(review.foodId),

    foodRating: Number(review.foodRating),

    serviceRating: Number(review.serviceRating),

    comment: review.comment || "",

    createdAt: review.createdAt,

    updatedAt: review.updatedAt,
  };
}

export const reviewService = {
  async create(
    payload: ReviewInput
  ): Promise<Review> {
    const response =
      await apiFetch<ApiResponse<Review>>(
        "/reviews",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

    return normalizeReview(response.data);
  },

  async listMine(): Promise<Review[]> {
    const response =
      await apiFetch<ApiResponse<Review[]>>(
        "/reviews"
      );

    return (response.data || []).map(
      (review: Review) =>
        normalizeReview(review)
    );
  },

  async listMyReviews(): Promise<Review[]> {
    return this.listMine();
  },

  async listAdmin(): Promise<Review[]> {
    const response =
      await apiFetch<ApiResponse<Review[]>>(
        "/admin/reviews"
      );

    return (response.data || []).map(
      (review: Review) =>
        normalizeReview(review)
    );
  },
};
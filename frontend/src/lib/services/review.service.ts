import { apiFetch } from "@/lib/api/client";

export type ReviewUser = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type ReviewFood = {
  _id?: string;
  name?: string;
  image?: string;
  price?: number;
};

export type ReviewOrder = {
  _id?: string;
  orderId?: string;
  createdAt?: string;
};

export type AdminReview = {
  _id: string;

  userId?: ReviewUser | string | null;

  orderId?: ReviewOrder | string | null;

  foodId?: ReviewFood | string | null;

  foodRating: number;

  serviceRating: number;

  comment: string;

  createdAt: string;

  updatedAt?: string;
};

export type CreateReviewPayload = {
  orderId: string;

  foodId: string;

  foodRating: number;

  serviceRating: number;

  comment: string;
};

export const reviewService = {
  async listAdmin(): Promise<AdminReview[]> {
    return apiFetch<AdminReview[]>(
      "/api/admin/reviews",
      {},
      "admin"
    );
  },

  async listMine(): Promise<AdminReview[]> {
    return apiFetch<AdminReview[]>(
      "/api/reviews"
    );
  },

  async create(
    payload: CreateReviewPayload
  ): Promise<AdminReview> {
    return apiFetch<AdminReview>(
      "/api/reviews",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      }
    );
  },
};
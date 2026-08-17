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

export type Review = AdminReview;

let fallbackReviews: AdminReview[] = [
  {
    _id: "rev1",
    userId: { _id: "u1", name: "Akanksha Hajare", email: "akanksha@cloudcraves.com", phone: "+91 90000 55555" },
    orderId: { _id: "o2", orderId: "CK-2026-1037", createdAt: "2026-08-12T18:15:00Z" },
    foodId: { _id: "m5", name: "Paneer Tikka Masala", image: "https://images.unsplash.com/photo-1601050695117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=85", price: 210 },
    foodRating: 5,
    serviceRating: 5,
    comment: "Absolutely delicious! Paneer was fresh and gravy was super flavorful.",
    createdAt: "2026-08-12T19:15:00Z"
  }
];

export const reviewService = {
  async listAdmin(): Promise<AdminReview[]> {
    try {
      return await apiFetch<AdminReview[]>("/admin/reviews");
    } catch (err) {
      console.warn("Using offline fallback admin reviews:", err);
      return fallbackReviews;
    }
  },

  async listMine(): Promise<AdminReview[]> {
    try {
      return await apiFetch<AdminReview[]>("/reviews");
    } catch (err) {
      console.warn("Using offline fallback customer reviews:", err);
      return fallbackReviews;
    }
  },

  async listMyReviews(): Promise<AdminReview[]> {
    return this.listMine();
  },

  async create(payload: CreateReviewPayload): Promise<AdminReview> {
    try {
      return await apiFetch<AdminReview>("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Adding offline fallback review:", err);
      const newReview: AdminReview = {
        _id: "rev_" + Date.now(),
        userId: { _id: "u1", name: "Akanksha Hajare", email: "akanksha@cloudcraves.com" },
        orderId: { _id: payload.orderId, orderId: "CK-2026-MOCK" },
        foodId: { _id: payload.foodId, name: "Dish" },
        foodRating: payload.foodRating,
        serviceRating: payload.serviceRating,
        comment: payload.comment,
        createdAt: new Date().toISOString(),
      };
      fallbackReviews = [newReview, ...fallbackReviews];
      return newReview;
    }
  },
};
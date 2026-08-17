export type Review = {
  id: string;
  _id?: string;

  userId?: string;

  orderId: string;

  foodId: string;

  foodRating: number;

  serviceRating: number;

  comment: string;

  createdAt: string;

  updatedAt?: string;

  customerName?: string;

  foodName?: string;
};

export type ReviewInput = {
  orderId: string;

  foodId: string;

  foodRating: number;

  serviceRating: number;

  comment: string;
};
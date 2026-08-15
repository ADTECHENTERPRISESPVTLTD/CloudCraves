import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  foodId: mongoose.Types.ObjectId;
  foodRating: number;
  serviceRating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    foodId: { type: Schema.Types.ObjectId, ref: 'Food', required: true, index: true },
    foodRating: { type: Number, required: true, min: 1, max: 5 },
    serviceRating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true }
  },
  {
    timestamps: true
  }
);

// Compound unique index to prevent duplicate reviews for the same user, order, and food item
ReviewSchema.index({ userId: 1, orderId: 1, foodId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);

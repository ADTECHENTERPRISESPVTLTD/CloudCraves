import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  ingredients: string[];
  preparationTime: string;
  spiceLevel: string;
  rating: number;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isSpecial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema: Schema<IFood> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    ingredients: [{ type: String }],
    preparationTime: { type: String, default: '15-20 mins' },
    spiceLevel: { type: String, default: 'Medium' },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isSpecial: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

FoodSchema.index({ name: 'text', description: 'text' });

export const Food = mongoose.model<IFood>('Food', FoodSchema);

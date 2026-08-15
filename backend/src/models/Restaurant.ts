import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  logo: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  deliveryAvailable: boolean;
  minimumOrder: number;
  deliveryCharge: number;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema: Schema<IRestaurant> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    openingTime: { type: String, default: '09:00 AM' },
    closingTime: { type: String, default: '10:00 PM' },
    isOpen: { type: Boolean, default: true },
    deliveryAvailable: { type: Boolean, default: true },
    minimumOrder: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);

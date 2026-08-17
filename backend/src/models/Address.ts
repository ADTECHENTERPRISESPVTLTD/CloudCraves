import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  village: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  addressType: 'Home' | 'Work' | 'Other';
  createdAt: Date;
}

const AddressSchema: Schema<IAddress> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    house: { type: String, required: true, trim: true },
    street: { type: String, default: '', trim: true },
    area: { type: String, required: true, trim: true },
    village: { type: String, default: '', trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    landmark: { type: String, default: '', trim: true },
    addressType: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Address = mongoose.model<IAddress>('Address', AddressSchema);

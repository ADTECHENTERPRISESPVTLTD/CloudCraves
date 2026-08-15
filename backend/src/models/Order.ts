import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  foodId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IDeliveryAddressSnapshot {
  name: string;
  phone: string;
  house: string;
  street?: string;
  area: string;
  village?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  addressType: string;
}

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'COD';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: string;
  userId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  totalAmount: number;
  deliveryAddress: IDeliveryAddressSnapshot;
  orderType: 'DELIVERY' | 'PICKUP';
  paymentMethod: 'COD' | 'ONLINE' | 'UPI' | 'CARD';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  specialInstructions: string;
  estimatedDeliveryTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    foodId: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const DeliveryAddressSnapshotSchema = new Schema<IDeliveryAddressSnapshot>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, default: '' },
    area: { type: String, required: true },
    village: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String, default: '' },
    addressType: { type: String, default: 'Home' }
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryAddress: { type: DeliveryAddressSnapshotSchema, required: true },
    orderType: { type: String, enum: ['DELIVERY', 'PICKUP'], default: 'DELIVERY' },
    paymentMethod: { type: String, enum: ['COD', 'ONLINE', 'UPI', 'CARD'], default: 'COD' },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'COD'],
      default: 'COD'
    },
    orderStatus: {
      type: String,
      enum: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED'
    },
    specialInstructions: { type: String, default: '' },
    estimatedDeliveryTime: { type: String, default: '30-45 mins' }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

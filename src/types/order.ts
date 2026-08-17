export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod =
  | "COD"
  | "ONLINE"
  | "UPI"
  | "CARD";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "COD";

export type OrderType =
  | "DELIVERY"
  | "PICKUP";

export type OrderItem = {
  foodId: string;
  name: string;
  quantity: number;
  price: number;
};

export type DeliveryAddressSnapshot = {
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
};

export type Order = {
  id?: string;
  _id?: string;

  orderId: string;

  userId?: string;
  restaurantId: string;

  items: OrderItem[];

  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  totalAmount: number;

  deliveryAddress: DeliveryAddressSnapshot;

  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  specialInstructions?: string;
  estimatedDeliveryTime?: string;

  createdAt: string;
  updatedAt?: string;
};
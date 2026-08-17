export type ApiId = string;

export type BackendCategory = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
};

export type BackendFood = {
  _id: string;
  name: string;
  description: string;
  image: string;

  categoryId:
    | string
    | {
        _id: string;
        name: string;
      };

  price: number;
  ingredients: string[];
  preparationTime: string;
  spiceLevel: string;
  rating: number;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isSpecial: boolean;
};

export type BackendReview = {
  _id: string;
  userId: any;
  orderId: any;
  foodId: any;
  foodRating: number;
  serviceRating: number;
  comment: string;
  createdAt: string;
};

export type BackendAddress = {
  _id: string;
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
  addressType: "Home" | "Work" | "Other";
};

export type BackendOrder = {
  _id: string;
  orderId: string;
  userId: any;
  restaurantId: string;

  items: {
    foodId: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  totalAmount: number;

  deliveryAddress: BackendAddress;

  orderType: "DELIVERY" | "PICKUP";

  paymentMethod:
    | "COD"
    | "ONLINE"
    | "UPI"
    | "CARD";

  paymentStatus: string;

  orderStatus:
    | "PLACED"
    | "ACCEPTED"
    | "PREPARING"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";

  specialInstructions: string;
  estimatedDeliveryTime: string;
  createdAt: string;
};
import { apiFetch } from "@/lib/api/client";
import type { Order, OrderStatus } from "@/types/order";

type BackendOrder = {
  _id: string;
  orderId: string;
  restaurantId: string;
  items: Array<{
    foodId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  totalAmount: number;
  deliveryAddress: {
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
  orderType: "DELIVERY" | "PICKUP";
  paymentMethod: "COD" | "ONLINE" | "UPI" | "CARD";
  paymentStatus: string;
  orderStatus: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
};

function mapStatus(status: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    PLACED: "pending",
    ACCEPTED: "accepted",
    PREPARING: "preparing",
    READY: "ready",
    OUT_FOR_DELIVERY: "out_for_delivery",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  };

  return map[status] || "pending";
}

function mapOrder(order: BackendOrder): Order {
  const address = order.deliveryAddress;

  return {
    id: order._id,
    orderNumber: order.orderId,
    restaurantId: order.restaurantId,
    restaurantName: "CloudCraves Kitchen",

    items: order.items.map((item) => ({
      id: item.foodId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),

    subtotal: order.subtotal,
    deliveryFee: order.deliveryCharge,
    total: order.totalAmount,

    status: mapStatus(order.orderStatus),

    customerName: address?.name || "",
    phone: address?.phone || "",

    address: [
      address?.house,
      address?.street,
      address?.area,
      address?.village,
      address?.city,
      address?.state,
      address?.pincode,
    ]
      .filter(Boolean)
      .join(", "),

    landmark: address?.landmark,

    deliveryRequested:
      order.orderType === "DELIVERY",

    createdAt: order.createdAt,

    note: order.specialInstructions,
  };
}

export const orderService = {
  async list(): Promise<Order[]> {
    const orders = await apiFetch<BackendOrder[]>(
      "/orders"
    );

    return orders.map(mapOrder);
  },

  async getById(id: string) {
    const order = await apiFetch<BackendOrder>(
      `/orders/${id}`
    );

    return mapOrder(order);
  },

  async getStatus(id: string) {
    return apiFetch<{
      orderId: string;
      orderStatus: string;
      paymentStatus: string;
      paymentMethod: string;
      estimatedDeliveryTime: string;
      createdAt: string;
      updatedAt: string;
    }>(`/orders/${id}/status`);
  },

  async create(data: {
    items: Array<{
      foodId: string;
      quantity: number;
    }>;
    addressId?: string;
    deliveryAddress?: {
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
      addressType?: string;
    };
    orderType: "DELIVERY" | "PICKUP";
    paymentMethod: "COD" | "ONLINE" | "UPI" | "CARD";
    specialInstructions?: string;
    discount?: number;
  }) {
    const order = await apiFetch<BackendOrder>(
      "/orders",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return mapOrder(order);
  },
};
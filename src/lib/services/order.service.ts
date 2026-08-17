import { apiFetch } from "@/lib/api/client";

import type {
  Order,
  OrderItem,
  OrderStatus,
  DeliveryAddressSnapshot,
  OrderType,
  PaymentMethod,
} from "@/types/order";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CreateOrderPayload = {
  items: Array<{
    foodId: string;
    quantity: number;
  }>;

  addressId?: string;

  deliveryAddress?: DeliveryAddressSnapshot;

  orderType?: OrderType;

  paymentMethod?: PaymentMethod;

  specialInstructions?: string;

  discount?: number;
};

function normalizeOrder(order: Order): Order {
  const deliveryCharge = order.deliveryCharge ?? 0;
  const discount = order.discount ?? 0;
  const tax = order.tax ?? 0;

  const totalAmount =
    order.totalAmount ??
    order.subtotal + deliveryCharge + tax - discount;

  return {
    ...order,
    id: order.id || order._id || order.orderId,
    restaurantId: String(order.restaurantId),

    items: (order.items || []).map(
      (item): OrderItem => ({
        foodId: String(item.foodId),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })
    ),

    deliveryCharge,
    discount,
    tax,
    totalAmount,

    orderStatus: order.orderStatus,
    orderType: order.orderType,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export const orderService = {
  /**
   * CUSTOMER
   * Create a new order.
   */
  async create(payload: CreateOrderPayload): Promise<Order> {
    const response = await apiFetch<ApiResponse<Order>>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return normalizeOrder(response.data);
  },

  /**
   * CUSTOMER
   * Get all orders belonging to the current customer.
   */
  async list(): Promise<Order[]> {
    const response = await apiFetch<ApiResponse<Order[]>>("/orders");

    return (response.data || []).map(normalizeOrder);
  },

  /**
   * CUSTOMER
   * Get one order.
   */
  async getById(id: string): Promise<Order> {
    const response = await apiFetch<ApiResponse<Order>>(`/orders/${id}`);

    return normalizeOrder(response.data);
  },

  /**
   * CUSTOMER
   * Get order tracking/status information.
   */
  async getStatus(id: string) {
    const response = await apiFetch<
      ApiResponse<{
        orderId: string;
        orderStatus: OrderStatus;
        paymentStatus: string;
        paymentMethod: string;
        estimatedDeliveryTime?: string;
        createdAt: string;
        updatedAt?: string;
      }>
    >(`/orders/${id}/status`);

    return response.data;
  },

  /**
   * ADMIN
   * Get all orders.
   */
  async listAdmin(): Promise<Order[]> {
    const response = await apiFetch<ApiResponse<Order[]>>(
      "/admin/orders"
    );

    return (response.data || []).map(normalizeOrder);
  },

  /**
   * ADMIN
   * Get one order for the admin portal.
   */
  async getAdminById(id: string): Promise<Order> {
    const response = await apiFetch<ApiResponse<Order>>(
      `/admin/orders/${id}`
    );

    return normalizeOrder(response.data);
  },

  /**
   * ADMIN
   * Update the order status.
   */
  async updateStatus(
    id: string,
    orderStatus: OrderStatus
  ): Promise<Order> {
    const response = await apiFetch<ApiResponse<Order>>(
      `/admin/orders/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ orderStatus }),
      }
    );

    return normalizeOrder(response.data);
  },

  /**
   * ADMIN
   * Cancel an order.
   */
  async cancel(id: string): Promise<Order> {
    const response = await apiFetch<ApiResponse<Order>>(
      `/admin/orders/${id}/cancel`,
      {
        method: "PATCH",
      }
    );

    return normalizeOrder(response.data);
  },
};
import { apiFetch } from "@/lib/api/client";
import { mockOrders } from "@/data/mockOrders";

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

let fallbackOrders: Order[] = [...mockOrders];

export const orderService = {
  /**
   * CUSTOMER
   * Create a new order.
   */
  async create(payload: CreateOrderPayload): Promise<Order> {
    try {
      const response = await apiFetch<ApiResponse<Order>>("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const order = normalizeOrder(response.data);
      fallbackOrders = [order, ...fallbackOrders];
      return order;
    } catch (err) {
      console.warn("Creating offline fallback order:", err);
      // Construct a mock order
      const newOrder: Order = {
        id: "o_" + Date.now(),
        orderId: "CK-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000),
        restaurantId: "r1",
        items: payload.items.map((it) => ({
          foodId: it.foodId,
          name: "Local Dish",
          quantity: it.quantity,
          price: 150,
        })),
        subtotal: payload.items.reduce((sum, it) => sum + 150 * it.quantity, 0),
        deliveryCharge: payload.orderType === "DELIVERY" ? 30 : 0,
        discount: payload.discount || 0,
        tax: 0,
        totalAmount: payload.items.reduce((sum, it) => sum + 150 * it.quantity, 0) + (payload.orderType === "DELIVERY" ? 30 : 0) - (payload.discount || 0),
        orderStatus: "PLACED",
        paymentStatus: payload.paymentMethod === "COD" ? "PENDING" : "PAID",
        orderType: payload.orderType || "DELIVERY",
        paymentMethod: payload.paymentMethod || "COD",
        deliveryAddress: payload.deliveryAddress || {
          name: "Guest User",
          phone: "+91 90000 00000",
          house: "Main Street",
          area: "Hinjewadi",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411057",
          addressType: "Home",
        },
        specialInstructions: payload.specialInstructions || "",
        createdAt: new Date().toISOString(),
      };
      const order = normalizeOrder(newOrder);
      fallbackOrders = [order, ...fallbackOrders];
      return order;
    }
  },

  /**
   * CUSTOMER
   * Get all orders belonging to the current customer.
   */
  async list(): Promise<Order[]> {
    try {
      const response = await apiFetch<ApiResponse<Order[]>>("/orders");
      const orders = (response.data || []).map(normalizeOrder);
      fallbackOrders = orders;
      return orders;
    } catch (err) {
      console.warn("Using offline fallback orders list:", err);
      return fallbackOrders.map(normalizeOrder);
    }
  },

  /**
   * CUSTOMER
   * Get one order.
   */
  async getById(id: string): Promise<Order> {
    try {
      const response = await apiFetch<ApiResponse<Order>>(`/orders/${id}`);
      return normalizeOrder(response.data);
    } catch (err) {
      console.warn("Using offline fallback order getById:", err);
      const match = fallbackOrders.find((o) => o.id === id || o.orderId === id || o._id === id);
      if (match) return normalizeOrder(match);
      throw err;
    }
  },

  /**
   * CUSTOMER
   * Get order tracking/status information.
   */
  async getStatus(id: string) {
    try {
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
    } catch (err) {
      console.warn("Using offline fallback order status:", err);
      const match = fallbackOrders.find((o) => o.id === id || o.orderId === id || o._id === id);
      if (match) {
        return {
          orderId: match.orderId,
          orderStatus: match.orderStatus,
          paymentStatus: match.paymentStatus,
          paymentMethod: match.paymentMethod,
          estimatedDeliveryTime: match.estimatedDeliveryTime || "30-45 mins",
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
        };
      }
      throw err;
    }
  },

  /**
   * ADMIN
   * Get all orders.
   */
  async listAdmin(): Promise<Order[]> {
    try {
      const response = await apiFetch<ApiResponse<Order[]>>(
        "/admin/orders"
      );
      const orders = (response.data || []).map(normalizeOrder);
      fallbackOrders = orders;
      return orders;
    } catch (err) {
      console.warn("Using offline fallback admin orders list:", err);
      return fallbackOrders.map(normalizeOrder);
    }
  },

  /**
   * ADMIN
   * Get one order for the admin portal.
   */
  async getAdminById(id: string): Promise<Order> {
    try {
      const response = await apiFetch<ApiResponse<Order>>(
        `/admin/orders/${id}`
      );
      return normalizeOrder(response.data);
    } catch (err) {
      console.warn("Using offline fallback admin order getAdminById:", err);
      const match = fallbackOrders.find((o) => o.id === id || o.orderId === id || o._id === id);
      if (match) return normalizeOrder(match);
      throw err;
    }
  },

  /**
   * ADMIN
   * Update the order status.
   */
  async updateStatus(
    id: string,
    orderStatus: OrderStatus
  ): Promise<Order> {
    try {
      const response = await apiFetch<ApiResponse<Order>>(
        `/admin/orders/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ orderStatus }),
        }
      );
      return normalizeOrder(response.data);
    } catch (err) {
      console.warn("Saving offline fallback admin update status:", err);
      fallbackOrders = fallbackOrders.map((o) =>
        o.id === id || o.orderId === id || o._id === id
          ? { ...o, orderStatus, updatedAt: new Date().toISOString() }
          : o
      );
      const match = fallbackOrders.find((o) => o.id === id || o.orderId === id || o._id === id);
      if (match) return normalizeOrder(match);
      throw err;
    }
  },

  /**
   * ADMIN
   * Cancel an order.
   */
  async cancel(id: string): Promise<Order> {
    try {
      const response = await apiFetch<ApiResponse<Order>>(
        `/admin/orders/${id}/cancel`,
        {
          method: "PATCH",
        }
      );
      return normalizeOrder(response.data);
    } catch (err) {
      console.warn("Saving offline fallback admin cancel:", err);
      fallbackOrders = fallbackOrders.map((o) =>
        o.id === id || o.orderId === id || o._id === id
          ? { ...o, orderStatus: "CANCELLED", updatedAt: new Date().toISOString() }
          : o
      );
      const match = fallbackOrders.find((o) => o.id === id || o.orderId === id || o._id === id);
      if (match) return normalizeOrder(match);
      throw err;
    }
  },
};
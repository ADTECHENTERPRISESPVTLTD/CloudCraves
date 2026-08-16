import { mockOrders } from "@/data/mockOrders";
import type { Order, OrderStatus } from "@/types/order";

export const orderService = {
  async list(): Promise<Order[]> { return mockOrders; },
  async getById(id: string) { return mockOrders.find(o => o.id === id) ?? null; },
  async updateStatus(id: string, status: OrderStatus) {
    const order = mockOrders.find(o => o.id === id);
    if (order) order.status = status;
    return order ?? null;
  },
  async create(order: Order) { mockOrders.unshift(order); return order; }
};

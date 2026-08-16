export type OrderStatus =
  | "pending" | "accepted" | "preparing" | "ready"
  | "out_for_delivery" | "delivered" | "cancelled";

export type OrderItem = { id: string; name: string; quantity: number; price: number; };
export type Order = {
  id: string; orderNumber: string; restaurantId: string; restaurantName: string;
  items: OrderItem[]; subtotal: number; deliveryFee: number; total: number;
  status: OrderStatus; customerName: string; phone: string; address: string;
  landmark?: string; deliveryRequested: boolean; createdAt: string; note?: string;
};

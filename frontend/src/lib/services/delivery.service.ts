import { orderService } from "./order.service";
import type { DeliveryRequest, DeliveryStatus } from "@/types/delivery";

function mapOrderStatusToDeliveryStatus(status: string): DeliveryStatus {
  if (status === "DELIVERED") return "completed";
  if (status === "OUT_FOR_DELIVERY") return "assigned";
  return "pending";
}

export const deliveryService = {
  async list(): Promise<DeliveryRequest[]> {
    const orders = await orderService.listAdmin();
    return orders
      .filter((o) => o.orderType === "DELIVERY" && o.orderStatus !== "CANCELLED")
      .map((o) => ({
        id: o.id || o.orderId,
        orderNumber: o.orderId,
        customerName: o.deliveryAddress.name,
        phone: o.deliveryAddress.phone,
        address: [
          o.deliveryAddress.house,
          o.deliveryAddress.street,
          o.deliveryAddress.area,
          o.deliveryAddress.city,
        ]
          .filter(Boolean)
          .join(", "),
        status: mapOrderStatusToDeliveryStatus(o.orderStatus),
        requestedAt: o.createdAt,
      }));
  },

  async updateStatus(id: string, status: DeliveryStatus): Promise<DeliveryRequest | null> {
    const nextOrderStatus = status === "assigned" ? "OUT_FOR_DELIVERY" : "DELIVERED";
    const updatedOrder = await orderService.updateStatus(id, nextOrderStatus);
    if (!updatedOrder) return null;
    return {
      id: updatedOrder.id || updatedOrder.orderId,
      orderNumber: updatedOrder.orderId,
      customerName: updatedOrder.deliveryAddress.name,
      phone: updatedOrder.deliveryAddress.phone,
      address: [
        updatedOrder.deliveryAddress.house,
        updatedOrder.deliveryAddress.street,
        updatedOrder.deliveryAddress.area,
        updatedOrder.deliveryAddress.city,
      ]
        .filter(Boolean)
        .join(", "),
      status: mapOrderStatusToDeliveryStatus(updatedOrder.orderStatus),
      requestedAt: updatedOrder.createdAt,
    };
  },
};

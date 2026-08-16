export type DeliveryStatus = "pending" | "assigned" | "completed";
export type DeliveryRequest = {
  id: string; orderNumber: string; customerName: string; phone: string;
  address: string; status: DeliveryStatus; requestedAt: string;
};

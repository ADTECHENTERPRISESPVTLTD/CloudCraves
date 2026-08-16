import type { DeliveryRequest } from "@/types/delivery";
const requests: DeliveryRequest[] = [
  { id: "d1", orderNumber: "CK-2026-1042", customerName: "Akanksha Hajare", phone: "+91 90000 55555", address: "Hinjewadi Phase 1, Pune", status: "pending", requestedAt: "2026-08-14T12:30:00Z" }
];
export const deliveryService = {
  async list() { return requests; },
  async updateStatus(id: string, status: DeliveryRequest["status"]) {
    const item = requests.find(r => r.id === id);
    if (item) item.status = status;
    return item ?? null;
  }
};

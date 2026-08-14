import type { Order } from "@/types/order";

export const mockOrders: Order[] = [
  {
    id: "o1", orderNumber: "CK-2026-1042", restaurantId: "r1", restaurantName: "Aai's Kitchen",
    items: [{ id: "m2", name: "Pithla Bhakri", quantity: 1, price: 160 }, { id: "m4", name: "Solkadhi", quantity: 1, price: 70 }],
    subtotal: 230, deliveryFee: 30, total: 260, status: "preparing",
    customerName: "Akanksha Hajare", phone: "+91 90000 55555",
    address: "Hinjewadi Phase 1, Pune", landmark: "Near the main bus stop",
    deliveryRequested: true, createdAt: "2026-08-14T12:30:00Z"
  },
  {
    id: "o2", orderNumber: "CK-2026-1037", restaurantId: "r2", restaurantName: "Tadka Town",
    items: [{ id: "m5", name: "Paneer Tikka Masala", quantity: 1, price: 210 }, { id: "m6", name: "Butter Naan", quantity: 2, price: 45 }],
    subtotal: 300, deliveryFee: 35, total: 335, status: "delivered",
    customerName: "Akanksha Hajare", phone: "+91 90000 55555",
    address: "Hinjewadi Phase 1, Pune", deliveryRequested: true, createdAt: "2026-08-12T18:15:00Z"
  }
];

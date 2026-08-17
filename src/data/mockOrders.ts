import type { Order } from "@/types/order";

export const mockOrders: Order[] = [
  {
    id: "o1",
    orderId: "CK-2026-1042",
    restaurantId: "r1",

    items: [
      {
        foodId: "m2",
        name: "Pithla Bhakri",
        quantity: 1,
        price: 160,
      },
      {
        foodId: "m4",
        name: "Solkadhi",
        quantity: 1,
        price: 70,
      },
    ],

    subtotal: 230,
    deliveryCharge: 30,
    discount: 0,
    tax: 0,
    totalAmount: 260,

    orderStatus: "PREPARING",
    paymentStatus: "PAID",
    orderType: "DELIVERY",
    paymentMethod: "COD",

    deliveryAddress: {
      name: "Akanksha Hajare",
      phone: "+91 90000 55555",
      house: "Flat 204",
      street: "Hinjewadi Road",
      area: "Hinjewadi Phase 1",
      village: "",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411057",
      landmark: "Near the main bus stop",
      addressType: "Home",
    },

    specialInstructions: "",
    createdAt: "2026-08-14T12:30:00Z",
    updatedAt: "2026-08-14T12:45:00Z",
  },

  {
    id: "o2",
    orderId: "CK-2026-1037",
    restaurantId: "r2",

    items: [
      {
        foodId: "m5",
        name: "Paneer Tikka Masala",
        quantity: 1,
        price: 210,
      },
      {
        foodId: "m6",
        name: "Butter Naan",
        quantity: 2,
        price: 45,
      },
    ],

    subtotal: 300,
    deliveryCharge: 35,
    discount: 0,
    tax: 0,
    totalAmount: 335,

    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
    orderType: "DELIVERY",
    paymentMethod: "COD",

    deliveryAddress: {
      name: "Akanksha Hajare",
      phone: "+91 90000 55555",
      house: "Flat 204",
      street: "Hinjewadi Road",
      area: "Hinjewadi Phase 1",
      village: "",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411057",
      landmark: "",
      addressType: "Home",
    },

    specialInstructions: "",
    createdAt: "2026-08-12T18:15:00Z",
    updatedAt: "2026-08-12T19:00:00Z",
  },

  {
    id: "o3",
    orderId: "CK-2026-1029",
    restaurantId: "r1",

    items: [
      {
        foodId: "m2",
        name: "Pithla Bhakri",
        quantity: 2,
        price: 160,
      },
      {
        foodId: "m4",
        name: "Solkadhi",
        quantity: 2,
        price: 70,
      },
    ],

    subtotal: 460,
    deliveryCharge: 30,
    discount: 20,
    tax: 0,
    totalAmount: 470,

    orderStatus: "PLACED",
    paymentStatus: "PENDING",
    orderType: "DELIVERY",
    paymentMethod: "COD",

    deliveryAddress: {
      name: "Akanksha Hajare",
      phone: "+91 90000 55555",
      house: "Flat 204",
      street: "Hinjewadi Road",
      area: "Hinjewadi Phase 1",
      village: "",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411057",
      landmark: "Near the main bus stop",
      addressType: "Home",
    },

    specialInstructions: "",
    createdAt: "2026-08-11T13:20:00Z",
    updatedAt: "2026-08-11T13:20:00Z",
  },
];
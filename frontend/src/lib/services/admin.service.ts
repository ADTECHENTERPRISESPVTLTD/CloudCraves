import { apiFetch } from "@/lib/api/client";
import { mockOrders } from "@/data/mockOrders";
import { mockCategories, mockMenus } from "@/data/mockMenus";

export type AdminOrder = {
  _id: string;
  orderId: string;
  items: Array<{
    foodId: string;
    name: string;
    price: number;
    quantity: number;
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
  orderType: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
};

export type Category = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder?: number;
};

export type AdminFood = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  categoryId:
    | string
    | {
        _id: string;
        name: string;
      };
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular?: boolean;
  isSpecial?: boolean;
};

// Memory fallback lists
let fallbackDashboard = {
  todayOrders: 3,
  todayRevenue: 1065,
  pendingOrders: 1,
  completedOrders: 2,
  activeMenuItems: 6,
  isOpen: true,
};

let fallbackOrders: AdminOrder[] = mockOrders.map((o) => ({
  _id: o.id || o._id || o.orderId,
  orderId: o.orderId,
  items: o.items.map((it) => ({
    foodId: it.foodId,
    name: it.name,
    price: it.price,
    quantity: it.quantity,
  })),
  subtotal: o.subtotal,
  deliveryCharge: o.deliveryCharge,
  discount: o.discount,
  tax: o.tax,
  totalAmount: o.totalAmount,
  deliveryAddress: o.deliveryAddress,
  orderType: o.orderType,
  paymentMethod: o.paymentMethod,
  paymentStatus: o.paymentStatus,
  orderStatus: o.orderStatus,
  createdAt: o.createdAt,
}));

let fallbackCategories: Category[] = mockCategories.map((c) => ({
  _id: c.id,
  name: c.name,
  isActive: true,
  sortOrder: 0,
}));

let fallbackFoods: AdminFood[] = mockMenus.map((m) => ({
  _id: m.id,
  name: m.name,
  description: m.description,
  image: m.image,
  categoryId: m.categoryId,
  price: m.price,
  isVeg: !!m.isVeg,
  isAvailable: m.isAvailable,
  isPopular: !!m.popular,
}));

export const adminService = {
  async dashboard() {
    try {
      return await apiFetch("/admin/dashboard");
    } catch (err) {
      console.warn("Using offline fallback dashboard data:", err);
      return fallbackDashboard;
    }
  },

  async orders() {
    try {
      return await apiFetch<AdminOrder[]>("/admin/orders");
    } catch (err) {
      console.warn("Using offline fallback orders data:", err);
      return fallbackOrders;
    }
  },

  async order(id: string) {
    try {
      return await apiFetch<AdminOrder>(`/admin/orders/${id}`);
    } catch (err) {
      console.warn("Using offline fallback order details:", err);
      const match = fallbackOrders.find((o) => o._id === id || o.orderId === id);
      if (match) return match;
      throw err;
    }
  },

  async updateOrderStatus(id: string, status: string) {
    try {
      return await apiFetch<AdminOrder>(`/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn("Saving offline fallback order status update:", err);
      fallbackOrders = fallbackOrders.map((o) =>
        o._id === id || o.orderId === id ? { ...o, orderStatus: status } : o
      );
      const match = fallbackOrders.find((o) => o._id === id || o.orderId === id);
      if (match) return match;
      throw err;
    }
  },

  async cancelOrder(id: string) {
    try {
      return await apiFetch(`/admin/orders/${id}/cancel`, {
        method: "PATCH",
      });
    } catch (err) {
      console.warn("Saving offline fallback cancel order:", err);
      fallbackOrders = fallbackOrders.map((o) =>
        o._id === id || o.orderId === id ? { ...o, orderStatus: "CANCELLED" } : o
      );
      const match = fallbackOrders.find((o) => o._id === id || o.orderId === id);
      if (match) return match;
      throw err;
    }
  },

  async categories() {
    try {
      return await apiFetch<Category[]>("/admin/categories");
    } catch (err) {
      console.warn("Using offline fallback categories list:", err);
      return fallbackCategories;
    }
  },

  async createCategory(data: {
    name: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    try {
      return await apiFetch<Category>("/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Creating offline fallback category:", err);
      const newCat: Category = {
        _id: "cat_" + Date.now(),
        name: data.name,
        description: data.description,
        image: data.image,
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder,
      };
      fallbackCategories = [...fallbackCategories, newCat];
      return newCat;
    }
  },

  async updateCategory(id: string, data: Partial<Category>) {
    try {
      return await apiFetch<Category>(`/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Updating offline fallback category:", err);
      fallbackCategories = fallbackCategories.map((c) =>
        c._id === id ? { ...c, ...data } : c
      );
      const match = fallbackCategories.find((c) => c._id === id);
      if (match) return match;
      throw err;
    }
  },

  async deleteCategory(id: string) {
    try {
      return await apiFetch(`/admin/categories/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Deleting offline fallback category:", err);
      fallbackCategories = fallbackCategories.filter((c) => c._id !== id);
      return { success: true };
    }
  },

  async foods() {
    try {
      return await apiFetch<AdminFood[]>("/admin/foods");
    } catch (err) {
      console.warn("Using offline fallback foods list:", err);
      return fallbackFoods;
    }
  },

  async createFood(data: Record<string, unknown>) {
    try {
      return await apiFetch<AdminFood>("/admin/foods", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Creating offline fallback food:", err);
      const newFood: AdminFood = {
        _id: "food_" + Date.now(),
        name: String(data.name || ""),
        description: String(data.description || ""),
        image: String(data.image || ""),
        categoryId: String(data.categoryId || ""),
        price: Number(data.price || 0),
        isVeg: Boolean(data.isVeg),
        isAvailable: Boolean(data.isAvailable),
        isPopular: Boolean(data.isPopular),
        isSpecial: Boolean(data.isSpecial),
      };
      fallbackFoods = [...fallbackFoods, newFood];
      return newFood;
    }
  },

  async updateFood(id: string, data: Record<string, unknown>) {
    try {
      return await apiFetch<AdminFood>(`/admin/foods/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Updating offline fallback food:", err);
      fallbackFoods = fallbackFoods.map((f) =>
        f._id === id
          ? {
              ...f,
              name: data.name !== undefined ? String(data.name) : f.name,
              description: data.description !== undefined ? String(data.description) : f.description,
              image: data.image !== undefined ? String(data.image) : f.image,
              categoryId: data.categoryId !== undefined ? String(data.categoryId) : f.categoryId,
              price: data.price !== undefined ? Number(data.price) : f.price,
              isVeg: data.isVeg !== undefined ? Boolean(data.isVeg) : f.isVeg,
              isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : f.isAvailable,
              isPopular: data.isPopular !== undefined ? Boolean(data.isPopular) : f.isPopular,
              isSpecial: data.isSpecial !== undefined ? Boolean(data.isSpecial) : f.isSpecial,
            }
          : f
      );
      const match = fallbackFoods.find((f) => f._id === id);
      if (match) return match;
      throw err;
    }
  },

  async deleteFood(id: string) {
    try {
      return await apiFetch(`/admin/foods/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Deleting offline fallback food:", err);
      fallbackFoods = fallbackFoods.filter((f) => f._id !== id);
      return { success: true };
    }
  },

  async reviews() {
    try {
      return await apiFetch("/admin/reviews");
    } catch (err) {
      console.warn("Using offline fallback reviews list:", err);
      return [];
    }
  },

  async customers() {
    try {
      return await apiFetch("/admin/customers");
    } catch (err) {
      console.warn("Using offline fallback customers list:", err);
      return [];
    }
  },
};
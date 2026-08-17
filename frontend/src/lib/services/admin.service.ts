import { apiFetch } from "@/lib/api/client";

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

export const adminService = {
  dashboard() {
    return apiFetch("/admin/dashboard");
  },

  orders() {
    return apiFetch<AdminOrder[]>("/admin/orders");
  },

  order(id: string) {
    return apiFetch<AdminOrder>(
      `/admin/orders/${id}`
    );
  },

  updateOrderStatus(
    id: string,
    status: string
  ) {
    return apiFetch<AdminOrder>(
      `/admin/orders/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
  },

  cancelOrder(id: string) {
    return apiFetch(
      `/admin/orders/${id}/cancel`,
      {
        method: "PATCH",
      }
    );
  },

  categories() {
    return apiFetch<Category[]>(
      "/admin/categories"
    );
  },

  createCategory(data: {
    name: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    return apiFetch<Category>(
      "/admin/categories",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  updateCategory(
    id: string,
    data: Partial<Category>
  ) {
    return apiFetch<Category>(
      `/admin/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteCategory(id: string) {
    return apiFetch(
      `/admin/categories/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  foods() {
    return apiFetch<AdminFood[]>(
      "/admin/foods"
    );
  },

  createFood(data: Record<string, unknown>) {
    return apiFetch<AdminFood>(
      "/admin/foods",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  updateFood(
    id: string,
    data: Record<string, unknown>
  ) {
    return apiFetch<AdminFood>(
      `/admin/foods/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteFood(id: string) {
    return apiFetch(
      `/admin/foods/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  reviews() {
    return apiFetch("/admin/reviews");
  },

  customers() {
    return apiFetch("/admin/customers");
  },
};
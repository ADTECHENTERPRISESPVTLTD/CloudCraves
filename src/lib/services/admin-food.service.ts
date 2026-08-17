import { apiFetch } from "@/lib/api/client";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type FoodPayload = {
  name: string;
  description?: string;
  image?: string;
  categoryId: string;
  price: number;
  ingredients?: string[];
  preparationTime?: string;
  spiceLevel?: string;
  isVeg?: boolean;
  isAvailable?: boolean;
  isPopular?: boolean;
  isSpecial?: boolean;
};

export const adminFoodService = {
  async list() {
    const response = await apiFetch<ApiResponse<any[]>>(
      "/admin/foods"
    );

    return response.data;
  },

  async getById(id: string) {
    const response = await apiFetch<ApiResponse<any>>(
      `/admin/foods/${id}`
    );

    return response.data;
  },

  async create(payload: FoodPayload) {
    const response = await apiFetch<ApiResponse<any>>(
      "/admin/foods",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    return response.data;
  },

  async update(id: string, payload: Partial<FoodPayload>) {
    const response = await apiFetch<ApiResponse<any>>(
      `/admin/foods/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return response.data;
  },

  async remove(id: string) {
    const response = await apiFetch<ApiResponse<any>>(
      `/admin/foods/${id}`,
      {
        method: "DELETE",
      }
    );

    return response.data;
  },
};
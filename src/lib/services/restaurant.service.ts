import { apiFetch } from "@/lib/api/client";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const restaurantService = {
  async get() {
    const response =
      await apiFetch<ApiResponse<any>>("/restaurant");

    return response.data;
  },

  async getMenu() {
    const response =
      await apiFetch<ApiResponse<any>>("/restaurant/menu");

    return response.data;
  },

  async getCategories() {
    const response =
      await apiFetch<ApiResponse<any>>(
        "/restaurant/categories"
      );

    return response.data;
  },
};
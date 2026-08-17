import { apiFetch } from "@/lib/api/client";

import type {
  MenuItem,
  RestaurantMenuCategory,
} from "@/types/menu";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const menuService = {
  /**
   * Get the full restaurant menu grouped by category.
   *
   * restaurantId is optional because the current backend endpoint
   * returns the main restaurant menu from /restaurant/menu.
   */
  async listByRestaurant(
    _restaurantId?: string
  ): Promise<RestaurantMenuCategory[]> {
    const response =
      await apiFetch<
        ApiResponse<RestaurantMenuCategory[]>
      >("/restaurant/menu");

    return response.data || [];
  },

  /**
   * Get public food items with optional filters.
   */
  async listFoods(params?: {
    category?: string;
    search?: string;
    veg?: boolean;
    popular?: boolean;
    special?: boolean;
  }): Promise<MenuItem[]> {
    const searchParams = new URLSearchParams();

    if (params?.category) {
      searchParams.set(
        "category",
        params.category
      );
    }

    if (params?.search) {
      searchParams.set(
        "search",
        params.search
      );
    }

    if (params?.veg !== undefined) {
      searchParams.set(
        "veg",
        String(params.veg)
      );
    }

    if (params?.popular !== undefined) {
      searchParams.set(
        "popular",
        String(params.popular)
      );
    }

    if (params?.special !== undefined) {
      searchParams.set(
        "special",
        String(params.special)
      );
    }

    const query =
      searchParams.toString();

    const response =
      await apiFetch<ApiResponse<MenuItem[]>>(
        `/foods${
          query ? `?${query}` : ""
        }`
      );

    return response.data || [];
  },

  /**
   * Get one food item.
   */
  async getFoodById(
    id: string
  ): Promise<MenuItem> {
    const response =
      await apiFetch<ApiResponse<MenuItem>>(
        `/foods/${id}`
      );

    return response.data;
  },
};
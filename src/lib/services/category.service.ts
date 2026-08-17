import { apiFetch } from "@/lib/api/client";

import type {
  Category,
  CategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

function normalizeCategory(category: Category): Category {
  return {
    _id: String(category._id),
    name: category.name ?? "",
    description: category.description ?? "",
    image: category.image ?? "",
    isActive: category.isActive ?? true,
    sortOrder: Number(category.sortOrder ?? 0),
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export const categoryService = {
  /**
   * Get public active categories.
   */
  async listPublic(): Promise<Category[]> {
    const response = await apiFetch<ApiResponse<Category[]>>(
      "/categories"
    );

    return (response.data || []).map(normalizeCategory);
  },

  /**
   * Admin: get all categories.
   */
  async listAdmin(): Promise<Category[]> {
    const response = await apiFetch<ApiResponse<Category[]>>(
      "/admin/categories"
    );

    return (response.data || []).map(normalizeCategory);
  },

  /**
   * Admin: create a category.
   */
  async create(
    payload: CategoryPayload
  ): Promise<Category> {
    const response = await apiFetch<ApiResponse<Category>>(
      "/admin/categories",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    return normalizeCategory(response.data);
  },

  /**
   * Admin: update one or more category fields.
   */
  async update(
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> {
    const response = await apiFetch<ApiResponse<Category>>(
      `/admin/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return normalizeCategory(response.data);
  },

  /**
   * Admin: delete a category.
   */
  async remove(id: string): Promise<Category> {
    const response = await apiFetch<ApiResponse<Category>>(
      `/admin/categories/${id}`,
      {
        method: "DELETE",
      }
    );

    return normalizeCategory(response.data);
  },
};
import { apiFetch } from "@/lib/api/client";
import type { BackendCategory } from "@/types/api";

export const categoryService = {
  list() {
    return apiFetch<BackendCategory[]>(
      "/api/admin/categories",
      {},
      "admin"
    );
  },

  publicList() {
    return apiFetch<BackendCategory[]>(
      "/api/restaurant/categories"
    );
  },

  create(data: Partial<BackendCategory>) {
    return apiFetch<BackendCategory>(
      "/api/admin/categories",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "admin"
    );
  },

  update(id: string, data: Partial<BackendCategory>) {
    return apiFetch<BackendCategory>(
      `/api/admin/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "admin"
    );
  },

  remove(id: string) {
    return apiFetch<BackendCategory>(
      `/api/admin/categories/${id}`,
      {
        method: "DELETE",
      },
      "admin"
    );
  },
};
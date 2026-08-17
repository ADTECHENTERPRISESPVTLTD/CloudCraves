import { apiFetch } from "@/lib/api/client";
import type { BackendAddress } from "@/types/api";

export const addressService = {
  list() {
    return apiFetch<BackendAddress[]>(
      "/api/users/addresses"
    );
  },

  create(data: Omit<BackendAddress, "_id">) {
    return apiFetch<BackendAddress>(
      "/api/users/addresses",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  update(id: string, data: Partial<BackendAddress>) {
    return apiFetch<BackendAddress>(
      `/api/users/addresses/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  remove(id: string) {
    return apiFetch<BackendAddress>(
      `/api/users/addresses/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
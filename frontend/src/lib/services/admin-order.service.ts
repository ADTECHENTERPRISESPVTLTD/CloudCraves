import { apiFetch } from "@/lib/api/client";
import type { BackendOrder } from "@/types/api";

export const adminOrderService = {
  list() {
    return apiFetch<BackendOrder[]>(
      "/api/admin/orders",
      {},
      "admin"
    );
  },

  getById(id: string) {
    return apiFetch<BackendOrder>(
      `/api/admin/orders/${id}`,
      {},
      "admin"
    );
  },

  updateStatus(
    id: string,
    orderStatus: BackendOrder["orderStatus"]
  ) {
    return apiFetch<BackendOrder>(
      `/api/admin/orders/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: orderStatus,
        }),
      },
      "admin"
    );
  },

  cancel(id: string) {
    return apiFetch<BackendOrder>(
      `/api/admin/orders/${id}/cancel`,
      {
        method: "PATCH",
      },
      "admin"
    );
  },
};
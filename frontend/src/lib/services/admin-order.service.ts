import { apiFetch } from "@/lib/api/client";
import type { BackendOrder } from "@/types/api";

export const adminOrderService = {
  list() {
    return apiFetch<BackendOrder[]>(
      "/admin/orders"
    );
  },

  getById(id: string) {
    return apiFetch<BackendOrder>(
      `/admin/orders/${id}`
    );
  },

  updateStatus(
    id: string,
    orderStatus: BackendOrder["orderStatus"]
  ) {
    return apiFetch<BackendOrder>(
      `/admin/orders/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: orderStatus,
        }),
      }
    );
  },

  cancel(id: string) {
    return apiFetch<BackendOrder>(
      `/admin/orders/${id}/cancel`,
      {
        method: "PATCH",
      }
    );
  },
};
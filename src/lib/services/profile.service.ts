import type { User } from "@/types/user";
import { apiFetch } from "@/lib/api/client";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const profileService = {
  async get(): Promise<User> {
    const response = await apiFetch<ApiResponse<User>>(
      "/users/me"
    );

    return response.data;
  },

  async update(data: Partial<User>): Promise<User> {
    const response = await apiFetch<ApiResponse<User>>(
      "/users/me",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    return response.data;
  },
};
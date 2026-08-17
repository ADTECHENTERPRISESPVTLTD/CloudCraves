import { apiFetch } from "@/lib/api/client";

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  addresses?: unknown[];
};

type CustomerAuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
};

type AdminAuthResponse = {
  success: boolean;
  message: string;
  data: {
    admin: {
      _id: string;
      name?: string;
      email: string;
      role: string;
    };
    token: string;
  };
};

export const authService = {
  async login(email: string, password: string) {
    const response = await apiFetch<CustomerAuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    localStorage.setItem(
      "cloudcraves_token",
      response.data.token
    );

    localStorage.setItem(
      "cloudcraves_user",
      JSON.stringify(response.data.user)
    );

    return response.data;
  },

  async register(
    name: string,
    phone: string,
    email: string,
    password: string
  ) {
    const response =
      await apiFetch<CustomerAuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
        }),
      });

    localStorage.setItem(
      "cloudcraves_token",
      response.data.token
    );

    localStorage.setItem(
      "cloudcraves_user",
      JSON.stringify(response.data.user)
    );

    return response.data;
  },

  async adminLogin(email: string, password: string) {
    const response =
      await apiFetch<AdminAuthResponse>("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

    localStorage.setItem(
      "cloudcraves_admin_token",
      response.data.token
    );

    localStorage.setItem(
      "cloudcraves_admin",
      JSON.stringify(response.data.admin)
    );

    return response.data;
  },

  logout() {
    localStorage.removeItem("cloudcraves_token");
    localStorage.removeItem("cloudcraves_user");
    localStorage.removeItem("cloudcraves_admin_token");
    localStorage.removeItem("cloudcraves_admin");
  },
};
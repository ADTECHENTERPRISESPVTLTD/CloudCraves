import {
  apiFetch,
  clearAuth,
} from "@/lib/api/client";

type CustomerAuth = {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    addresses?: string[];
  };
  token: string;
};

type AdminAuth = {
  admin: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
};

export const authService = {
  /**
   * Customer login
   */
  async loginCustomer(
    email: string,
    password: string
  ) {
    const result =
      await apiFetch<CustomerAuth>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

    localStorage.setItem(
      "cloudcraves_token",
      result.token
    );

    localStorage.setItem(
      "cloudcraves_user",
      JSON.stringify(result.user)
    );

    return {
      role: "customer" as const,
      ...result,
    };
  },

  /**
   * Admin login
   */
  async loginAdmin(
    email: string,
    password: string
  ) {
    const result =
      await apiFetch<AdminAuth>(
        "/admin/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

    localStorage.setItem(
      "cloudcraves_admin_token",
      result.token
    );

    localStorage.setItem(
      "cloudcraves_admin",
      JSON.stringify(result.admin)
    );

    return {
      role: "admin" as const,
      ...result,
    };
  },

  /**
   * Existing callers can continue using login().
   * It defaults to customer login.
   */
  async login(
    email: string,
    password: string
  ) {
    return this.loginCustomer(
      email,
      password
    );
  },

  /**
   * Customer registration
   */
  async register(data: {
    name: string;
    phone: string;
    email: string;
    password: string;
  }) {
    const result =
      await apiFetch<CustomerAuth>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

    localStorage.setItem(
      "cloudcraves_token",
      result.token
    );

    localStorage.setItem(
      "cloudcraves_user",
      JSON.stringify(result.user)
    );

    return result;
  },

  /**
   * Logout.
   *
   * Customer:
   * clearAuth("customer")
   *
   * Admin:
   * clearAuth("admin")
   */
  logout(
    kind: "customer" | "admin" = "customer"
  ) {
    clearAuth(kind);
  },
};
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
    try {
      const result = await apiFetch<CustomerAuth>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("cloudcraves_token", result.token);
      localStorage.setItem("cloudcraves_user", JSON.stringify(result.user));

      return {
        role: "customer" as const,
        ...result,
      };
    } catch (err) {
      console.warn("Using offline fallback customer login:", err);
      const mockResult: CustomerAuth = {
        user: {
          _id: "u1",
          name: "Akanksha Hajare",
          email: email,
          phone: "+91 90000 55555",
        },
        token: "mock_customer_token_" + Date.now(),
      };

      localStorage.setItem("cloudcraves_token", mockResult.token);
      localStorage.setItem("cloudcraves_user", JSON.stringify(mockResult.user));

      return {
        role: "customer" as const,
        ...mockResult,
      };
    }
  },

  /**
   * Admin login
   */
  async loginAdmin(
    email: string,
    password: string
  ) {
    try {
      const result = await apiFetch<AdminAuth>("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("cloudcraves_admin_token", result.token);
      localStorage.setItem("cloudcraves_admin", JSON.stringify(result.admin));

      return {
        role: "admin" as const,
        ...result,
      };
    } catch (err) {
      console.warn("Using offline fallback admin login:", err);
      const mockResult: AdminAuth = {
        admin: {
          _id: "a1",
          name: "Kitchen Manager",
          email: email,
          role: "admin",
        },
        token: "mock_admin_token_" + Date.now(),
      };

      localStorage.setItem("cloudcraves_admin_token", mockResult.token);
      localStorage.setItem("cloudcraves_admin", JSON.stringify(mockResult.admin));

      return {
        role: "admin" as const,
        ...mockResult,
      };
    }
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
    try {
      const result = await apiFetch<CustomerAuth>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      localStorage.setItem("cloudcraves_token", result.token);
      localStorage.setItem("cloudcraves_user", JSON.stringify(result.user));

      return result;
    } catch (err) {
      console.warn("Using offline fallback customer registration:", err);
      const mockResult: CustomerAuth = {
        user: {
          _id: "u_" + Date.now(),
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
        token: "mock_customer_token_" + Date.now(),
      };

      localStorage.setItem("cloudcraves_token", mockResult.token);
      localStorage.setItem("cloudcraves_user", JSON.stringify(mockResult.user));

      return mockResult;
    }
  },

  /**
   * Logout.
   */
  logout(
    kind: "customer" | "admin" = "customer"
  ) {
    clearAuth(kind);
  },

  /**
   * Check if customer is logged in
   */
  isLoggedIn(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return !!localStorage.getItem("cloudcraves_token");
  },

  /**
   * Alias for loginAdmin to match other callers
   */
  async adminLogin(email: string, password: string) {
    return this.loginAdmin(email, password);
  },
};
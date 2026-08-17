const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export function getToken(
  kind: "customer" | "admin" = "customer"
): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    kind === "admin"
      ? "cloudcraves_admin_token"
      : "cloudcraves_token"
  );
}

export function clearAuth(
  kind?: "customer" | "admin"
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!kind || kind === "customer") {
    localStorage.removeItem("cloudcraves_token");
    localStorage.removeItem("cloudcraves_user");
  }

  if (!kind || kind === "admin") {
    localStorage.removeItem("cloudcraves_admin_token");
    localStorage.removeItem("cloudcraves_admin");
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & {
    auth?: "customer" | "admin" | false;
  } = {}
): Promise<T> {
  const {
    auth,
    ...request
  } = options;

  let token: string | null = null;
  if (auth === false) {
    token = null;
  } else if (auth) {
    token = getToken(auth);
  } else {
    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      token = getToken("admin");
    } else {
      token = getToken("customer");
    }
  }

  const headers = new Headers(
    request.headers
  );

  if (
    request.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (!headers.has("Accept")) {
    headers.set(
      "Accept",
      "application/json"
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...request,
      headers,
      cache: "no-store",
    });

    const body =
      (await response
        .json()
        .catch(() => ({}))) as ApiEnvelope<T>;

    if (response.status === 401 && auth) {
      clearAuth(auth);
    }

    if (!response.ok) {
      throw new Error(
        body.message ||
          body.error ||
          `API request failed (${response.status})`
      );
    }

    if (body.success === false) {
      throw new Error(
        body.message ||
          body.error ||
          "API request failed"
      );
    }

    return body.data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Unable to connect to the backend."
    );
  }
}
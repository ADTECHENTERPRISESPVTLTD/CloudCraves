"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If the user was redirected to login from another page,
  // send them back there after successful login.
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await authService.login(email, password);

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login."
      );
      setLoading(false);
    }
  }

  async function handleDemoCustomerLogin() {
    setLoading(true);
    setError("");

    setEmail("customer@cloudcraves.com");
    setPassword("password123");

    try {
      await authService.login(
        "customer@cloudcraves.com",
        "password123"
      );

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError("Demo customer login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff1e8] p-4">
      <form
        onSubmit={submit}
        className="card-kitchen w-full max-w-md p-7"
      >
        <h1 className="text-3xl font-black text-[#6b4f3a]">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-[#6d625a]">
          Sign in to continue ordering.
        </p>

        <label className="mt-6 block text-sm font-bold">
          Email
          <input
            className="input-kitchen mt-1"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          Password
          <input
            className="input-kitchen mt-1"
            type="password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </label>

        {error && (
          <div className="mt-4 rounded-xl bg-[#f8e6e1] p-3 text-sm font-semibold text-[#b33b21]">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 border-t border-[#eadfd2] pt-5">
          <p className="text-xs text-center font-bold text-[#8c8177] mb-3">
            FAST DEMO ACCESS
          </p>

          <div className="grid gap-2 grid-cols-2">
            <button
              type="button"
              onClick={handleDemoCustomerLogin}
              disabled={loading}
              className="btn-secondary text-xs min-h-[38px] py-1 bg-[#fffaf5] hover:bg-[#fff1e8]"
            >
              Demo Customer
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/login")}
              disabled={loading}
              className="btn-secondary text-xs min-h-[38px] py-1 bg-[#6b4f3a] text-white hover:bg-[#523c2c]"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#e4572e]"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

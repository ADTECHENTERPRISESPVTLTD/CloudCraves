"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await authService.adminLogin(
        email,
        password
      );

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid admin credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoAdminLogin() {
    setLoading(true);
    setError("");
    setEmail("admin@cloudcraves.com");
    setPassword("password123");
    try {
      await authService.adminLogin("admin@cloudcraves.com", "password123");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Demo admin login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#6b4f3a] p-4">
      <form
        onSubmit={submit}
        className="card-kitchen w-full max-w-md p-7"
      >
        <p className="text-sm font-black text-[#e4572e]">
          CLOUDCRAVES
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Admin sign in
        </h1>

        <label className="mt-6 block text-sm font-bold">
          Email

          <input
            required
            type="email"
            className="input-kitchen mt-1"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          Password

          <input
            required
            type="password"
            className="input-kitchen mt-1"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </label>

        {error && (
          <div className="mt-4 rounded-xl bg-[#f8e6e1] p-3 text-sm text-[#b33b21]">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:opacity-60"
        >
          {loading
            ? "Signing in..."
            : "Sign in"}
        </button>

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 border-t border-[#eadfd2] pt-5">
          <p className="text-xs text-center font-bold text-[#8c8177] mb-3">
            FAST DEMO ACCESS
          </p>
          <div className="grid gap-2 grid-cols-2">
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              disabled={loading}
              className="btn-secondary text-xs min-h-[38px] py-1 bg-[#fffaf5] hover:bg-[#fff1e8]"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              disabled={loading}
              className="btn-secondary text-xs min-h-[38px] py-1 bg-[#e4572e] text-white hover:bg-[#cf4823]"
            >
              Customer Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
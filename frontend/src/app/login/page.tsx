"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";

export default function LoginPage() {
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
      await authService.login(email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login."
      );
    } finally {
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
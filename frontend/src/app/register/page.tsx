"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await authService.register(form);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
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
          Create account
        </h1>

        <label className="mt-6 block text-sm font-bold">
          Full name
          <input
            required
            minLength={2}
            className="input-kitchen mt-1"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          Email
          <input
            required
            type="email"
            className="input-kitchen mt-1"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          Phone
          <input
            required
            pattern="[6-9][0-9]{9}"
            className="input-kitchen mt-1"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          Password
          <input
            required
            minLength={6}
            type="password"
            className="input-kitchen mt-1"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
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
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#e4572e]"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
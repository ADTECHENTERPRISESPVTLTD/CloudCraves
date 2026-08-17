"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await authService.register(
        name,
        phone,
        email,
        password
      );

      router.push("/");
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
        onSubmit={handleSubmit}
        className="card-kitchen w-full max-w-md p-7"
      >
        <h1 className="text-3xl font-black text-[#6b4f3a]">
          Create account
        </h1>

        <p className="mt-2 text-sm text-[#6d625a]">
          Create your CloudCraves customer account.
        </p>

        <label className="mt-6 block text-sm font-bold">
          Full name

          <input
            required
            minLength={2}
            className="input-kitchen mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          Email

          <input
            required
            type="email"
            className="input-kitchen mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          Phone

          <input
            required
            type="tel"
            pattern="[6-9][0-9]{9}"
            className="input-kitchen mt-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          Password

          <input
            required
            minLength={6}
            type="password"
            className="input-kitchen mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-[#b33b21]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full"
        >
          {loading ? "Creating account…" : "Register"}
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
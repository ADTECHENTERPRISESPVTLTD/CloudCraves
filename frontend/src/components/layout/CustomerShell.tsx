"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  User,
  MapPin,
  Menu,
  X,
  Search,
  ClipboardList,
  Shield,
} from "lucide-react";

type CustomerShellProps = {
  children: React.ReactNode;
};

export default function CustomerShell({
  children,
}: CustomerShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff8ee] text-[#2e2a27]">
      <header className="sticky top-0 z-50 border-b border-[#eadfd2] bg-white/95 backdrop-blur-xl">
        <div className="container-kitchen flex min-h-[70px] items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="text-[22px] font-black tracking-[-0.04em] text-[#e4572e]">
              Local<span className="text-[#6b4f3a]">Bite</span>
            </div>

            <div className="hidden text-[10px] font-semibold tracking-wide text-[#9a8e85] sm:block">
              LOCAL FOOD • DIRECT ORDER
            </div>
          </Link>

          {/* Location */}
          <button className="hidden items-center gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-[#fff5ee] md:flex">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff1e8] text-[#e4572e]">
              <MapPin size={18} />
            </span>

            <span>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-[#9a8e85]">
                Deliver to
              </span>
              <span className="block text-sm font-extrabold text-[#6b4f3a]">
                Hinjewadi, Pune
              </span>
            </span>
          </button>

          {/* Desktop search */}
          <div className="hidden max-w-[420px] flex-1 lg:block">
            <div className="search-kitchen">
              <Search size={18} className="shrink-0 text-[#9a8e85]" />
              <input
                aria-label="Search food or restaurants"
                placeholder="Search restaurants, dishes or cuisines"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/restaurants"
              className="rounded-xl px-3 py-2 text-sm font-bold text-[#6b4f3a] transition hover:bg-[#fff1e8]"
            >
              Restaurants
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#6b4f3a] transition hover:bg-[#fff1e8]"
            >
              <ClipboardList size={17} />
              Orders
            </Link>

            <Link
              href="/cart"
              className="rounded-xl p-2.5 text-[#6b4f3a] transition hover:bg-[#fff1e8]"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
            </Link>

            <Link
              href="/profile"
              className="rounded-xl p-2.5 text-[#6b4f3a] transition hover:bg-[#fff1e8]"
              aria-label="Profile"
            >
              <User size={20} />
            </Link>

            <Link
              href="/admin"
              className="rounded-xl p-2.5 text-[#6b4f3a] transition hover:bg-[#fff1e8]"
              aria-label="Admin"
            >
              <Shield size={20} />
            </Link>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/cart"
              className="rounded-xl p-2.5 text-[#6b4f3a]"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={21} />
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-xl p-2.5 text-[#6b4f3a]"
              aria-label="Open navigation"
            >
              <Menu size={23} />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="container-kitchen pb-3 md:hidden">
          <div className="search-kitchen">
            <Search size={18} className="shrink-0 text-[#9a8e85]" />
            <input
              aria-label="Search food or restaurants"
              placeholder="Search food or restaurants"
            />
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="mobile-menu"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="mobile-menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xl font-black text-[#e4572e]">
                Local<span className="text-[#6b4f3a]">Bite</span>
              </span>

              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-xl p-2 hover:bg-[#fff1e8]"
                aria-label="Close navigation"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-7 rounded-2xl bg-[#fff8ee] p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1e8] text-[#e4572e]">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#9a8e85]">
                    DELIVERY LOCATION
                  </p>
                  <p className="font-extrabold text-[#6b4f3a]">
                    Hinjewadi, Pune
                  </p>
                </div>
              </div>
            </div>

            <nav className="grid gap-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold hover:bg-[#fff1e8]"
              >
                Home
              </Link>

              <Link
                href="/restaurants"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold hover:bg-[#fff1e8]"
              >
                Restaurants
              </Link>

              <Link
                href="/orders"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold hover:bg-[#fff1e8]"
              >
                My Orders
              </Link>

              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold hover:bg-[#fff1e8]"
              >
                Profile
              </Link>

              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-bold hover:bg-[#fff1e8]"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      )}

      <main>{children}</main>

      <footer className="mt-16 border-t border-[#eadfd2] bg-white">
        <div className="container-kitchen py-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-black text-[#e4572e]">
                Local<span className="text-[#6b4f3a]">Bite</span>
              </p>

              <p className="mt-1 text-sm text-[#6d625a]">
                Good food from local kitchens.
              </p>
            </div>

            <div className="grid gap-2 text-sm text-[#6d625a] sm:text-right">
              <span>Direct ordering • Local delivery • Fresh food</span>
              <span>© 2026 LocalBite</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Tags,
  Star,
  Store,
  Truck,
  Settings,
  LogOut,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

const links = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/orders", "Orders", ClipboardList],
  ["/admin/menu", "Menu", Utensils],
  ["/admin/categories", "Categories", Tags],
  ["/admin/reviews", "Reviews", Star],
  ["/admin/restaurant", "Restaurant", Store],
  ["/admin/delivery", "Delivery", Truck],
  ["/admin/settings", "Settings", Settings],
] as const;

export default function AdminSidebar() {
  const path = usePathname();

  const router = useRouter();

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cloudcraves_admin_token");
      localStorage.removeItem("cloudcraves_admin");
    }

    router.push("/admin/login");
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#eadfd2] bg-white p-4 lg:block">
      {/* Brand */}
      <div className="mb-8 px-3 text-xl font-black text-[#6b4f3a]">
        Local<span className="text-[#e4572e]">Bite</span>

        <p className="text-xs font-semibold text-[#6d625a]">
          Admin Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {links.map(([href, label, Icon]) => {
          const active =
            href === "/admin"
              ? path === "/admin"
              : path === href ||
                path.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 font-semibold transition ${
                active
                  ? "bg-[#fff1e8] text-[#e4572e]"
                  : "text-[#6d625a] hover:bg-[#f3f1ec]"
              }`}
            >
              <Icon size={19} />

              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="mt-8 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-[#6d625a] transition hover:bg-[#f3f1ec]"
      >
        <LogOut size={19} />

        <span>Logout</span>
      </button>
    </aside>
  );
}
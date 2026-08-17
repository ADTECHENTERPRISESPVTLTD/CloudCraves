"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Store,
  Truck,
  Settings,
  LogOut,
  Tags,
  Star,
} from "lucide-react";

import { usePathname } from "next/navigation";

const links = [
  [
    "/admin",
    "Dashboard",
    LayoutDashboard,
  ],
  [
    "/admin/orders",
    "Orders",
    ClipboardList,
  ],
  [
    "/admin/menu",
    "Menu",
    Utensils,
  ],
  [
    "/admin/categories",
    "Categories",
    Tags,
  ],
  [
    "/admin/reviews",
    "Reviews",
    Star,
  ],
  [
    "/admin/restaurant",
    "Restaurant",
    Store,
  ],
  [
    "/admin/delivery",
    "Delivery",
    Truck,
  ],
  [
    "/admin/settings",
    "Settings",
    Settings,
  ],
] as const;

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#eadfd2] bg-white p-4 lg:block">
      <div className="mb-8 px-3">
        <div className="text-xl font-black text-[#6b4f3a]">
          Cloud
          <span className="text-[#e4572e]">
            Craves
          </span>
        </div>

        <p className="text-xs font-semibold text-[#6d625a]">
          Admin Portal
        </p>
      </div>

      <nav className="space-y-1">
        {links.map(
          ([href, label, Icon]) => {
            const isActive =
              path === href ||
              (href !== "/admin" &&
                path.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 font-semibold ${
                  isActive
                    ? "bg-[#fff1e8] text-[#e4572e]"
                    : "text-[#6d625a] hover:bg-[#f3f1ec]"
                }`}
              >
                <Icon size={19} />

                {label}
              </Link>
            );
          }
        )}
      </nav>

      <Link
        href="/admin/login"
        className="mt-8 flex items-center gap-3 px-3 py-3 font-semibold text-[#6d625a]"
      >
        <LogOut size={19} />
        Logout
      </Link>
    </aside>
  );
}
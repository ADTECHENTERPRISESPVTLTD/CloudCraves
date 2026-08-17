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
  X,
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

type AdminSidebarProps = {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
};

export default function AdminSidebar({ mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const path = usePathname();
  const router = useRouter();

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cloudcraves_admin_token");
      localStorage.removeItem("cloudcraves_admin");
    }
    router.push("/admin/login");
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white p-4">
      {/* Brand & Close button on mobile */}
      <div className="mb-8 flex items-center justify-between px-3 text-xl font-black text-[#6b4f3a]">
        <div>
          Local<span className="text-[#e4572e]">Bite</span>
          <p className="text-xs font-semibold text-[#6d625a]">Admin Portal</p>
        </div>
        {setMobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 hover:bg-[#f3f1ec] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {links.map(([href, label, Icon]) => {
          const active =
            href === "/admin"
              ? path === "/admin"
              : path === href || path.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen?.(false)}
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
        className="mt-auto flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-[#6d625a] transition hover:bg-[#f3f1ec]"
      >
        <LogOut size={19} />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[#eadfd2] bg-white lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen?.(false)}
          />
          {/* Drawer content */}
          <aside className="relative flex h-full w-64 max-w-xs flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
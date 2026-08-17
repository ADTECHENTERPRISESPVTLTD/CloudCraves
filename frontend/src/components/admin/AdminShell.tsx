"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff8ee] lg:flex">
      {/* Sidebar for Desktop & Mobile */}
      <AdminSidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      
      <div className="min-w-0 flex-1">
        <header className="border-b border-[#eadfd2] bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-1.5 text-[#6b4f3a] hover:bg-[#fff1e8] lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu size={22} />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6d625a]">
                  Restaurant workspace
                </p>
                <h1 className="font-extrabold text-sm sm:text-base text-[#6b4f3a]">
                  Aai's Kitchen
                </h1>
              </div>
            </div>
            <span className="badge-open rounded-full px-3 py-1 text-xs sm:text-sm font-bold">
              Open
            </span>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

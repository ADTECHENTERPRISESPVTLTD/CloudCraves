"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { authService } from "@/lib/services/auth.service";

export default function AdminSettings() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  function handleLogout() {
    authService.logout("admin");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <AdminShell>
      <h2 className="text-3xl font-black text-[#6b4f3a]">Settings</h2>
      <div className="card-kitchen mt-6 max-w-2xl p-6 space-y-5">
        <label className="flex items-center justify-between gap-4">
          <span>
            <b>New order notifications</b>
            <p className="text-sm text-[#6d625a]">Show alerts for incoming orders.</p>
          </span>
          <input type="checkbox" defaultChecked className="h-5 w-5" />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span>
            <b>Delivery notifications</b>
            <p className="text-sm text-[#6d625a]">Notify staff about delivery requests.</p>
          </span>
          <input type="checkbox" defaultChecked className="h-5 w-5" />
        </label>
        <button
          className="btn-primary"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
        >
          Save preferences
        </button>
        {saved && <p className="text-sm font-bold text-[#5c8d47]">Preferences saved.</p>}
        <button className="block text-sm font-bold text-[#b33b21]" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </AdminShell>
  );
}

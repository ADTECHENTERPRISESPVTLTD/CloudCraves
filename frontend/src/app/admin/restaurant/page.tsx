"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { restaurantService } from "@/lib/services/restaurant.service";

export default function AdminRestaurant() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    openingTime: "",
    closingTime: "",
    isOpen: true,
    deliveryAvailable: true,
    deliveryCharge: 0,
    minimumOrder: 100,
  });

  useEffect(() => {
    restaurantService
      .get()
      .then((data: any) => {
        // Parse addresses snapshot
        const addressParts = (data.address || "").split(", ");
        const mainAddress = addressParts[0] || "";
        const city = addressParts[1] || "";
        const state = addressParts[2] || "";
        const pincode = addressParts[3] || "";

        const hoursParts = (data.hours || "").split(" - ");
        const openingTime = hoursParts[0] || "08:00 AM";
        const closingTime = hoursParts[1] || "10:00 PM";

        setForm({
          name: data.name || "",
          description: data.description || "",
          phone: data.phone || "",
          address: mainAddress,
          city: city,
          state: state,
          pincode: pincode,
          openingTime: openingTime,
          closingTime: closingTime,
          isOpen: data.isOpen ?? true,
          deliveryAvailable: data.deliveryAvailable ?? true,
          deliveryCharge: data.deliveryCharge ?? 0,
          minimumOrder: data.minimumOrder ?? 100,
        });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load restaurant details.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await restaurantService.update({
        name: form.name.trim(),
        description: form.description.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        openingTime: form.openingTime,
        closingTime: form.closingTime,
        isOpen: form.isOpen,
        deliveryAvailable: form.deliveryAvailable,
        deliveryCharge: Number(form.deliveryCharge),
        minimumOrder: Number(form.minimumOrder),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update restaurant profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="h-10 w-60 animate-pulse rounded-xl bg-[#eee8df]" />
        <div className="card-kitchen mt-6 max-w-3xl h-96 animate-pulse" />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <h2 className="text-3xl font-black text-[#6b4f3a]">Restaurant profile</h2>
      <p className="mt-1 text-sm text-[#6d625a]">
        Configure your cloud kitchen branding and operating metrics.
      </p>

      {error && (
        <div className="mt-5 max-w-3xl rounded-xl bg-[#f8e6e1] p-4 text-sm font-semibold text-[#b33b21]">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="card-kitchen mt-6 max-w-3xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold block">
            Restaurant name *
            <input
              required
              className="input-kitchen mt-1 w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label className="text-sm font-bold block">
            Contact phone *
            <input
              required
              className="input-kitchen mt-1 w-full"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>

          <label className="sm:col-span-2 text-sm font-bold block">
            Description
            <textarea
              className="input-kitchen mt-1 w-full min-h-20"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <label className="sm:col-span-2 text-sm font-bold block">
            Address (Street, Building) *
            <input
              required
              className="input-kitchen mt-1 w-full"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-3 sm:col-span-2">
            <label className="text-sm font-bold block">
              City *
              <input
                required
                className="input-kitchen mt-1 w-full"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>

            <label className="text-sm font-bold block">
              State *
              <input
                required
                className="input-kitchen mt-1 w-full"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </label>

            <label className="text-sm font-bold block">
              Pincode *
              <input
                required
                className="input-kitchen mt-1 w-full"
                pattern="[0-9]{6}"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
            </label>
          </div>

          <label className="text-sm font-bold block">
            Opening time (e.g. 08:00 AM) *
            <input
              required
              className="input-kitchen mt-1 w-full"
              value={form.openingTime}
              onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
            />
          </label>

          <label className="text-sm font-bold block">
            Closing time (e.g. 10:00 PM) *
            <input
              required
              className="input-kitchen mt-1 w-full"
              value={form.closingTime}
              onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
            />
          </label>

          <label className="text-sm font-bold block">
            Minimum order amount (₹) *
            <input
              required
              type="number"
              min="0"
              className="input-kitchen mt-1 w-full"
              value={form.minimumOrder}
              onChange={(e) => setForm({ ...form, minimumOrder: Number(e.target.value) })}
            />
          </label>

          <label className="text-sm font-bold block">
            Delivery charge (₹) *
            <input
              required
              type="number"
              min="0"
              className="input-kitchen mt-1 w-full"
              value={form.deliveryCharge}
              onChange={(e) => setForm({ ...form, deliveryCharge: Number(e.target.value) })}
            />
          </label>
        </div>

        <div className="mt-5 space-y-3">
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
            />
            Restaurant is currently open (accepting orders)
          </label>

          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={form.deliveryAvailable}
              onChange={(e) => setForm({ ...form, deliveryAvailable: e.target.checked })}
            />
            Home delivery is available
          </label>
        </div>

        <button type="submit" disabled={saving} className="btn-primary mt-6">
          {saving ? "Saving..." : "Save profile"}
        </button>

        {saved && (
          <p className="mt-3 text-sm font-bold text-[#5c8d47]">
            Profile updated successfully.
          </p>
        )}
      </form>
    </AdminShell>
  );
}

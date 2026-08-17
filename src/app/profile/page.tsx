"use client";

import { useEffect, useState } from "react";

import CustomerShell from "@/components/layout/CustomerShell";
import AddressCard from "@/components/customer/AddressCard";

import { profileService } from "@/lib/services/profile.service";
import { addressService } from "@/lib/services/address.service";

import type { Address, User } from "@/types/user";

type AddressForm = {
  label: string;
  name: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  village: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
};

const emptyForm: AddressForm = {
  label: "Home",
  name: "",
  phone: "",
  house: "",
  street: "",
  area: "",
  village: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  const [form, setForm] =
    useState<AddressForm>(emptyForm);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    profileService
      .get()
      .then(setUser)
      .catch(() => {
        setError("Unable to load profile.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-10">
          <div className="h-10 w-52 animate-pulse rounded-xl bg-[#eee8df]" />

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-3xl bg-[#eee8df]" />

            <div className="h-80 animate-pulse rounded-3xl bg-[#eee8df]" />
          </div>
        </div>
      </CustomerShell>
    );
  }

  /*
   * Profile loading failed
   */
  if (!user) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          <div className="card-kitchen p-8 text-center">
            <h2 className="font-black">
              Unable to load profile
            </h2>

            <p className="mt-2 text-sm text-[#6d625a]">
              {error || "Please try again later."}
            </p>
          </div>
        </div>
      </CustomerShell>
    );
  }

  /*
   * TypeScript knows user is not null from here.
   */
  const currentUser: User = user;

  /*
   * Open form for adding a new address.
   */
  function openAddAddress() {
    setEditingAddress(null);

    setForm({
      ...emptyForm,

      name: currentUser.name,

      phone: currentUser.phone
        .replace(/\D/g, "")
        .slice(-10),
    });

    setMessage("");
    setError("");

    setShowAddressForm(true);
  }

  /*
   * Open form for editing an existing address.
   *
   * IMPORTANT:
   * Address now uses the backend fields:
   * addressType, house, street, area, village,
   * city, state, pincode, landmark, etc.
   */
  function openEditAddress(address: Address) {
    setEditingAddress(address);

    setForm({
      label: address.addressType || "Home",

      name:
        address.name || currentUser.name,

      phone:
        address.phone
          .replace(/\D/g, "")
          .slice(-10),

      house: address.house || "",

      street: address.street || "",

      area: address.area || "",

      village: address.village || "",

      city: address.city || "",

      state: address.state || "",

      pincode: address.pincode || "",

      landmark: address.landmark || "",
    });

    setMessage("");
    setError("");

    setShowAddressForm(true);
  }

  /*
   * Save or update address.
   */
  async function saveAddress() {
    setError("");
    setMessage("");

    /*
     * Name validation
     */
    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    /*
     * Phone validation
     */
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError(
        "Enter a valid 10-digit phone number."
      );
      return;
    }

    /*
     * House/building validation
     */
    if (!form.house.trim()) {
      setError(
        "Please enter your house/building number."
      );
      return;
    }

    /*
     * Area validation
     */
    if (!form.area.trim()) {
      setError("Please enter your area.");
      return;
    }

    /*
     * City validation
     */
    if (!form.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    /*
     * State validation
     */
    if (!form.state.trim()) {
      setError("Please enter your state.");
      return;
    }

    /*
     * Pincode validation
     */
    if (!/^\d{6}$/.test(form.pincode)) {
      setError(
        "Enter a valid 6-digit pincode."
      );
      return;
    }

    setSaving(true);

    try {
      /*
       * Payload expected by the address service/backend.
       */
      const payload = {
        name: form.name.trim(),

        phone: form.phone,

        house: form.house.trim(),

        street: form.street.trim(),

        area: form.area.trim(),

        village: form.village.trim(),

        city: form.city.trim(),

        state: form.state.trim(),

        pincode: form.pincode,

        landmark: form.landmark.trim(),

        addressType:
          form.label.trim() || "Home",
      };

      /*
       * Update existing address.
       */
      if (editingAddress) {
        await addressService.update(
          editingAddress.id,
          payload
        );
      }

      /*
       * Create new address.
       */
      else {
        await addressService.create(payload);
      }

      /*
       * Reload addresses after saving.
       */
      const addresses =
        await addressService.list();

      /*
       * Update local profile state.
       */
      setUser({
        id: currentUser.id,

        name: currentUser.name,

        email: currentUser.email,

        phone: currentUser.phone,

        addresses,
      });

      /*
       * Close form.
       */
      setShowAddressForm(false);

      setEditingAddress(null);

      setForm(emptyForm);

      /*
       * Success message.
       */
      setMessage(
        editingAddress
          ? "Address updated successfully."
          : "Address added successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save address."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Delete address.
   */
  async function deleteAddress(id: string) {
    const confirmed =
      window.confirm(
        "Delete this address?"
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await addressService.remove(id);

      /*
       * Reload addresses after deletion.
       */
      const addresses =
        await addressService.list();

      setUser({
        id: currentUser.id,

        name: currentUser.name,

        email: currentUser.email,

        phone: currentUser.phone,

        addresses,
      });

      setMessage(
        "Address deleted successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete address."
      );
    }
  }

  /*
   * Select default address.
   *
   * For now this keeps the existing frontend
   * behavior without introducing a new API.
   */
  function makeDefault(id: string) {
    setMessage(
      "Default address selected."
    );

    /*
     * Keep the selected address first
     * in local state.
     */
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      const selected =
        previousUser.addresses.find(
          (address) =>
            address.id === id
        );

      if (!selected) {
        return previousUser;
      }

      const remaining =
        previousUser.addresses.filter(
          (address) =>
            address.id !== id
        );

      return {
        ...previousUser,
        addresses: [
          selected,
          ...remaining,
        ],
      };
    });
  }

  /*
   * Save personal profile.
   */
  async function saveProfile() {
    setError("");
    setMessage("");

    try {
      const updatedUser =
        await profileService.update({
          name: currentUser.name,

          phone: currentUser.phone,
        });

      setUser(updatedUser);

      setMessage(
        "Profile saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save profile."
      );
    }
  }

  /*
   * Close address modal.
   */
  function closeAddressForm() {
    setShowAddressForm(false);

    setEditingAddress(null);

    setForm(emptyForm);

    setError("");
  }

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-4xl font-black text-[#6b4f3a]">
            My profile
          </h1>

          <p className="mt-2 text-sm text-[#6d625a]">
            Manage your personal details and
            delivery addresses.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mt-5 rounded-xl bg-[#e8f3e3] p-4 text-sm font-bold text-[#5c8d47]">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-5 rounded-xl bg-[#f8e6e1] p-4 text-sm font-semibold text-[#b33b21]">
            {error}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          {/* PERSONAL DETAILS */}
          <section className="card-kitchen p-6">
            <h2 className="text-xl font-black">
              Personal details
            </h2>

            <div className="mt-5 space-y-4">
              {/* NAME */}
              <label className="block text-sm font-bold">
                Name

                <input
                  type="text"
                  className="input-kitchen mt-1"
                  value={currentUser.name}
                  onChange={(event) =>
                    setUser({
                      ...currentUser,

                      name: event.target.value,
                    })
                  }
                />
              </label>

              {/* EMAIL */}
              <label className="block text-sm font-bold">
                Email

                <input
                  type="email"
                  disabled
                  readOnly
                  className="input-kitchen mt-1 bg-[#f3f1ec]"
                  value={currentUser.email}
                />
              </label>

              {/* PHONE */}
              <label className="block text-sm font-bold">
                Phone

                <input
                  type="tel"
                  inputMode="numeric"
                  className="input-kitchen mt-1"
                  value={currentUser.phone}
                  onChange={(event) =>
                    setUser({
                      ...currentUser,

                      phone:
                        event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <button
              type="button"
              className="btn-primary mt-5"
              onClick={saveProfile}
            >
              Save profile
            </button>
          </section>

          {/* SAVED ADDRESSES */}
          <section className="card-kitchen p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black">
                  Saved addresses
                </h2>

                <p className="mt-1 text-sm text-[#6d625a]">
                  Manage your delivery
                  locations.
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={openAddAddress}
              >
                + Add address
              </button>
            </div>

            {/* NO ADDRESSES */}
            {currentUser.addresses.length ===
            0 ? (
              <div className="mt-5 rounded-2xl bg-[#f3f1ec] p-8 text-center">
                <h3 className="font-black">
                  No saved addresses
                </h3>

                <p className="mt-1 text-sm text-[#6d625a]">
                  Add an address for
                  faster checkout.
                </p>
              </div>
            ) : (
              /* ADDRESS LIST */
              <div className="mt-5 space-y-4">
                {currentUser.addresses.map(
                  (address, index) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      isDefault={index === 0}
                      onEdit={
                        openEditAddress
                      }
                      onDelete={
                        deleteAddress
                      }
                      onDefault={
                        makeDefault
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        </div>

        {/* ADDRESS MODAL */}
        {showAddressForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#6b4f3a]">
                    {editingAddress
                      ? "Edit address"
                      : "Add address"}
                  </h2>

                  <p className="mt-1 text-sm text-[#6d625a]">
                    Enter your delivery
                    details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeAddressForm
                  }
                  className="rounded-full px-3 py-2 text-2xl leading-none text-[#6d625a] hover:bg-[#f3f1ec]"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* FORM */}
              <div className="mt-6 space-y-4">
                {/* ADDRESS TYPE */}
                <label className="block text-sm font-bold">
                  Address Type

                  <select
                    className="input-kitchen mt-1"
                    value={form.label}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        label:
                          event.target
                            .value,
                      })
                    }
                  >
                    <option value="Home">
                      Home
                    </option>

                    <option value="Work">
                      Work
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </label>

                {/* NAME */}
                <label className="block text-sm font-bold">
                  Name

                  <input
                    type="text"
                    className="input-kitchen mt-1"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        name: event.target
                          .value,
                      })
                    }
                  />
                </label>

                {/* PHONE */}
                <label className="block text-sm font-bold">
                  Phone

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="input-kitchen mt-1"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        phone:
                          event.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    }
                  />
                </label>

                {/* HOUSE */}
                <label className="block text-sm font-bold">
                  House / Flat / Building

                  <input
                    type="text"
                    className="input-kitchen mt-1"
                    placeholder="e.g. Flat 204, Building A"
                    value={form.house}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        house:
                          event.target
                            .value,
                      })
                    }
                  />
                </label>

                {/* STREET */}
                <label className="block text-sm font-bold">
                  Street / Road

                  <input
                    type="text"
                    className="input-kitchen mt-1"
                    placeholder="Street or road"
                    value={form.street}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        street:
                          event.target
                            .value,
                      })
                    }
                  />
                </label>

                {/* AREA */}
                <label className="block text-sm font-bold">
                  Area / Locality

                  <input
                    type="text"
                    className="input-kitchen mt-1"
                    placeholder="Area or locality"
                    value={form.area}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        area:
                          event.target.value,
                      })
                    }
                  />
                </label>

                {/* VILLAGE */}
                <label className="block text-sm font-bold">
                  Village

                  <input
                    type="text"
                    className="input-kitchen mt-1"
                    placeholder="Village (optional)"
                    value={form.village}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        village:
                          event.target
                            .value,
                      })
                    }
                  />
                </label>

                {/* CITY */}
                <label className="block text-sm font-bold">
                  City

                  <input
                    type="text"
                    className="input-kitchen mt-1"
                    placeholder="City"
                    value={form.city}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        city:
                          event.target.value,
                      })
                    }
                  />
                </label>

                {/* STATE */}
                <label className="block text-sm font-bold">
                  State

                  <input
                    type="text"
                    className="input-kitchen mt-1"
                    placeholder="State"
                    value={form.state}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        state:
                          event.target
                            .value,
                      })
                    }
                  />
                </label>

                {/* PINCODE */}
                <label className="block text-sm font-bold">
                  Pincode

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="input-kitchen mt-1"
                    placeholder="6-digit pincode"
                    value={form.pincode}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        pincode:
                          event.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    }
                  />
                </label>

                {/* LANDMARK */}
                <label className="block text-sm font-bold">
                  Landmark

                  <input
                    type="text"
                    className="input-kitchen mt-1"
                    placeholder="Near..."
                    value={form.landmark}
                    onChange={(event) =>
                      setForm({
                        ...form,

                        landmark:
                          event.target
                            .value,
                      })
                    }
                  />
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={
                    closeAddressForm
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  className="btn-primary disabled:opacity-60"
                  onClick={saveAddress}
                >
                  {saving
                    ? "Saving..."
                    : editingAddress
                      ? "Update address"
                      : "Save address"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerShell>
  );
}
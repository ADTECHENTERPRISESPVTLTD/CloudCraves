"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerShell from "@/components/layout/CustomerShell";
import { profileService } from "@/lib/services/profile.service";
import { authService } from "@/lib/services/auth.service";
import type { User } from "@/types/user";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [editing, setEditing] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [address, setAddress] = useState({
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
    addressType: "Home" as "Home" | "Work" | "Other",
  });

  useEffect(() => {
    profileService
      .get()
      .then(setUser)
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load profile."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile() {
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      const updated = await profileService.update(user);
      setUser(updated);
      setEditing(false);
      setSaved(true);

      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const updated = await profileService.addAddress(
        address
      );

      setUser(updated);

      setShowAddress(false);

      setAddress({
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
        addressType: "Home",
      });
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

  if (loading) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          <div className="animate-pulse rounded-2xl bg-[#f3f1ec] p-10">
            Loading profile...
          </div>
        </div>
      </CustomerShell>
    );
  }

  if (!user) {
    return (
      <CustomerShell>
        <div className="container-kitchen py-16">
          Unable to load profile.
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-4xl font-black text-[#6b4f3a]">
              My profile
            </h1>
          </div>

          <button
            className="btn-secondary"
            onClick={() => {
              authService.logout();
              router.push("/login");
              router.refresh();
            }}
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-[#f8e6e1] p-4 text-sm font-semibold text-[#b33b21]">
            {error}
          </div>
        )}

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <section className="card-kitchen p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                Personal details
              </h2>

              <button
                className="btn-secondary py-2"
                onClick={() =>
                  setEditing(!editing)
                }
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-bold">
                Name

                <input
                  disabled={!editing}
                  className="input-kitchen mt-1 disabled:bg-[#f3f1ec]"
                  value={user.name}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label className="block text-sm font-bold">
                Email

                <input
                  disabled
                  className="input-kitchen mt-1 bg-[#f3f1ec]"
                  value={user.email}
                  readOnly
                />
              </label>

              <label className="block text-sm font-bold">
                Phone

                <input
                  disabled={!editing}
                  className="input-kitchen mt-1 disabled:bg-[#f3f1ec]"
                  value={user.phone}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      phone: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            {editing && (
              <button
                className="btn-primary mt-5"
                disabled={saving}
                onClick={saveProfile}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            )}

            {saved && (
              <p className="mt-3 text-sm font-bold text-[#5c8d47]">
                Profile saved.
              </p>
            )}
          </section>

          <section className="card-kitchen p-6">
            <h2 className="text-xl font-black">
              Saved addresses
            </h2>

            {user.addresses.length === 0 && (
              <p className="mt-4 text-sm text-[#6d625a]">
                No saved addresses yet.
              </p>
            )}

            {user.addresses.map((a) => (
              <div
                key={a.id}
                className="mt-4 rounded-2xl bg-[#f3f1ec] p-4"
              >
                <b>{a.label}</b>

                <p className="mt-1 text-sm text-[#6d625a]">
                  {a.address}
                </p>

                {a.landmark && (
                  <p className="text-sm text-[#6d625a]">
                    Landmark: {a.landmark}
                  </p>
                )}
              </div>
            ))}

            <button
              className="btn-secondary mt-4"
              onClick={() =>
                setShowAddress(!showAddress)
              }
            >
              + Add address
            </button>

            {showAddress && (
              <form
                onSubmit={saveAddress}
                className="mt-5 space-y-3"
              >
                <input
                  required
                  className="input-kitchen"
                  placeholder="Full name"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  required
                  className="input-kitchen"
                  placeholder="Phone"
                  pattern="[6-9][0-9]{9}"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      phone: e.target.value,
                    })
                  }
                />

                <input
                  required
                  className="input-kitchen"
                  placeholder="House / Flat"
                  value={address.house}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      house: e.target.value,
                    })
                  }
                />

                <input
                  className="input-kitchen"
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      street: e.target.value,
                    })
                  }
                />

                <input
                  required
                  className="input-kitchen"
                  placeholder="Area"
                  value={address.area}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      area: e.target.value,
                    })
                  }
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    className="input-kitchen"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        city: e.target.value,
                      })
                    }
                  />

                  <input
                    required
                    className="input-kitchen"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        state: e.target.value,
                      })
                    }
                  />
                </div>

                <input
                  required
                  className="input-kitchen"
                  placeholder="Pincode"
                  pattern="[0-9]{6}"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      pincode: e.target.value,
                    })
                  }
                />

                <input
                  className="input-kitchen"
                  placeholder="Landmark"
                  value={address.landmark}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      landmark: e.target.value,
                    })
                  }
                />

                <select
                  className="input-kitchen"
                  value={address.addressType}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      addressType:
                        e.target.value as
                          | "Home"
                          | "Work"
                          | "Other",
                    })
                  }
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>

                <button
                  disabled={saving}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save address"}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </CustomerShell>
  );
}

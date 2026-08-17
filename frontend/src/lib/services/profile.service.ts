import { apiFetch } from "@/lib/api/client";
import type { User, Address } from "@/types/user";

type BackendUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
};

type BackendAddress = {
  _id: string;
  name: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  village: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  addressType: "Home" | "Work" | "Other";
};

function mapAddress(address: BackendAddress): Address {
  return {
    id: address._id,
    label: address.addressType,
    address: [
      address.house,
      address.street,
      address.area,
      address.village,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", "),
    landmark: address.landmark,
    phone: address.phone,
  };
}

let fallbackUser: User = {
  id: "u1",
  name: "Akanksha Hajare",
  email: "akanksha@cloudcraves.com",
  phone: "+91 90000 55555",
  addresses: [
    {
      id: "a1",
      label: "Home",
      address: "Flat 204, Hinjewadi Road, Hinjewadi Phase 1, Pune, Maharashtra, 411057",
      landmark: "Near the main bus stop",
      phone: "+91 90000 55555",
    },
  ],
};

export const profileService = {
  async get(): Promise<User> {
    try {
      const [user, addresses] = await Promise.all([
        apiFetch<BackendUser>("/users/me"),
        apiFetch<BackendAddress[]>("/users/addresses"),
      ]);

      const liveUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: addresses.map(mapAddress),
      };

      fallbackUser = liveUser;
      return liveUser;
    } catch (err) {
      console.warn("Using offline fallback profile:", err);
      return fallbackUser;
    }
  },

  async update(data: Partial<User>) {
    try {
      await apiFetch<BackendUser>("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
        }),
      });
      return this.get();
    } catch (err) {
      console.warn("Saving offline fallback profile update:", err);
      fallbackUser = {
        ...fallbackUser,
        name: data.name || fallbackUser.name,
        phone: data.phone || fallbackUser.phone,
      };
      return fallbackUser;
    }
  },

  async addAddress(data: {
    name: string;
    phone: string;
    house: string;
    street?: string;
    area: string;
    village?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    addressType?: "Home" | "Work" | "Other";
  }) {
    try {
      await apiFetch<BackendAddress>("/users/addresses", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return this.get();
    } catch (err) {
      console.warn("Adding offline fallback address:", err);
      const newAddressStr = [
        data.house,
        data.street,
        data.area,
        data.village,
        data.city,
        data.state,
        data.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      const newAddress: Address = {
        id: "a_" + Date.now(),
        label: data.addressType || "Home",
        address: newAddressStr,
        landmark: data.landmark,
        phone: data.phone,
      };

      fallbackUser = {
        ...fallbackUser,
        addresses: [...fallbackUser.addresses, newAddress],
      };
      return fallbackUser;
    }
  },

  async deleteAddress(id: string) {
    try {
      await apiFetch(`/users/addresses/${id}`, {
        method: "DELETE",
      });
      return this.get();
    } catch (err) {
      console.warn("Deleting offline fallback address:", err);
      fallbackUser = {
        ...fallbackUser,
        addresses: fallbackUser.addresses.filter((a) => a.id !== id),
      };
      return fallbackUser;
    }
  },
};
import { apiFetch, getToken } from "@/lib/api/client";
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

export const profileService = {
  async get(): Promise<User> {
    if (!getToken("customer")) {
      throw new Error("NOT_AUTHENTICATED");
    }

    const [user, addresses] = await Promise.all([
      apiFetch<BackendUser>("/users/me"),
      apiFetch<BackendAddress[]>("/users/addresses"),
    ]);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: addresses.map(mapAddress),
    };
  },

  async update(data: Partial<User>): Promise<User> {
    if (!getToken("customer")) {
      throw new Error("NOT_AUTHENTICATED");
    }

    await apiFetch<BackendUser>("/users/me", {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
      }),
    });

    return this.get();
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
  }): Promise<User> {
    if (!getToken("customer")) {
      throw new Error("NOT_AUTHENTICATED");
    }

    await apiFetch<BackendAddress>("/users/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return this.get();
  },

  async deleteAddress(id: string): Promise<User> {
    if (!getToken("customer")) {
      throw new Error("NOT_AUTHENTICATED");
    }

    await apiFetch(`/users/addresses/${id}`, {
      method: "DELETE",
    });

    return this.get();
  },
};
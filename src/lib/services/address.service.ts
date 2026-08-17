import { apiFetch } from "@/lib/api/client";
import type { Address } from "@/types/user";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AddressPayload = {
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
  addressType: string;
};

function normalizeAddress(address: Address): Address {
  return {
    ...address,

    id: String(address.id),

    name: address.name || "",

    phone: address.phone || "",

    house: address.house || "",

    street: address.street || "",

    area: address.area || "",

    village: address.village || "",

    city: address.city || "",

    state: address.state || "",

    pincode: address.pincode || "",

    landmark: address.landmark || "",

    addressType:
      address.addressType || "Home",
  };
}

export const addressService = {
  async list(): Promise<Address[]> {
    const response =
      await apiFetch<ApiResponse<Address[]>>(
        "/addresses"
      );

    return (response.data || []).map(
      normalizeAddress
    );
  },

  async create(
    payload: AddressPayload
  ): Promise<Address> {
    const response =
      await apiFetch<ApiResponse<Address>>(
        "/addresses",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

    return normalizeAddress(response.data);
  },

  async update(
    id: string,
    payload: AddressPayload
  ): Promise<Address> {
    const response =
      await apiFetch<ApiResponse<Address>>(
        `/addresses/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

    return normalizeAddress(response.data);
  },

  async remove(id: string): Promise<void> {
    await apiFetch<ApiResponse<null>>(
      `/addresses/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
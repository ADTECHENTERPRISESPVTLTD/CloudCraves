import { apiFetch } from "@/lib/api/client";
import { mockRestaurants } from "@/data/mockRestaurants";
import type { Restaurant } from "@/types/restaurant";

type BackendRestaurant = {
  _id: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  isOpen?: boolean;
  deliveryAvailable?: boolean;
  deliveryCharge?: number;
  minimumOrder?: number;
};

function mapRestaurant(data: BackendRestaurant): Restaurant {
  return {
    id: data._id,
    name: data.name,
    cuisine: "Local / Multi-cuisine",
    rating: 4.5,
    reviews: 80,
    distanceKm: 1.5,
    deliveryMinutes: 30,
    isOpen: Boolean(data.isOpen),
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    address: [data.address, data.city, data.state, data.pincode]
      .filter(Boolean)
      .join(", "),
    phone: data.phone || "",
    description: data.description || "",
    hours:
      data.openingTime && data.closingTime
        ? `${data.openingTime} - ${data.closingTime}`
        : "Opening hours unavailable",
    deliveryAvailable: Boolean(data.deliveryAvailable),
  };
}

let fallbackRestaurants: Restaurant[] = [...mockRestaurants];

export const restaurantService = {
  async get(): Promise<Restaurant> {
    try {
      const data = await apiFetch<BackendRestaurant>("/restaurant");
      const mapped = mapRestaurant(data);
      fallbackRestaurants = [mapped];
      return mapped;
    } catch (err) {
      console.warn("Using offline fallback restaurant:", err);
      return fallbackRestaurants[0];
    }
  },

  async list(): Promise<Restaurant[]> {
    try {
      const data = await apiFetch<BackendRestaurant>("/restaurant");
      const mapped = mapRestaurant(data);
      fallbackRestaurants = [mapped];
      return [mapped];
    } catch (err) {
      console.warn("Using offline fallback restaurant list:", err);
      return fallbackRestaurants;
    }
  },

  async getById(id: string): Promise<Restaurant> {
    try {
      const data = await apiFetch<BackendRestaurant>("/restaurant");
      return mapRestaurant(data);
    } catch (err) {
      console.warn("Using offline fallback restaurant getById:", err);
      const match = fallbackRestaurants.find((r) => r.id === id);
      return match || fallbackRestaurants[0];
    }
  },

  async update(data: Partial<BackendRestaurant>): Promise<Restaurant> {
    try {
      const response = await apiFetch<BackendRestaurant>("/restaurant", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const updated = mapRestaurant(response);
      fallbackRestaurants = [updated];
      return updated;
    } catch (err) {
      console.warn("Saving offline fallback restaurant update:", err);
      const current = fallbackRestaurants[0];
      const addressParts = (current.address || "").split(", ");
      const mainAddress = addressParts[0] || "";
      const city = addressParts[1] || "";
      const state = addressParts[2] || "";
      const pincode = addressParts[3] || "";

      const updatedFields: Restaurant = {
        ...current,
        name: data.name || current.name,
        description: data.description || current.description,
        phone: data.phone || current.phone,
        isOpen: data.isOpen !== undefined ? data.isOpen : current.isOpen,
        deliveryAvailable: data.deliveryAvailable !== undefined ? data.deliveryAvailable : current.deliveryAvailable,
        address: [
          data.address || mainAddress,
          data.city || city,
          data.state || state,
          data.pincode || pincode,
        ]
          .filter(Boolean)
          .join(", "),
        hours:
          data.openingTime && data.closingTime
            ? `${data.openingTime} - ${data.closingTime}`
            : current.hours,
      };

      fallbackRestaurants = [updatedFields];
      return updatedFields;
    }
  },
};
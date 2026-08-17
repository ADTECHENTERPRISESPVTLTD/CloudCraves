import { apiFetch } from "@/lib/api/client";
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
    rating: 0,
    reviews: 0,
    distanceKm: 0,
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

export const restaurantService = {
  async get() {
    const data = await apiFetch<BackendRestaurant>(
      "/restaurant"
    );

    return mapRestaurant(data);
  },

  async list() {
    const restaurant = await this.get();

    return [restaurant];
  },

  async getById(_id: string) {
    return this.get();
  },
};
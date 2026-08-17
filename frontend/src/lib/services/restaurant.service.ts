import { mockRestaurants } from "@/data/mockRestaurants";
export const restaurantService = {
  async list() { return mockRestaurants; },
  async getById(id: string) { return mockRestaurants.find(r => r.id === id) ?? null; }
};

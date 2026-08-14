import { mockMenus, mockCategories } from "@/data/mockMenus";
export const menuService = {
  async listByRestaurant(restaurantId: string) {
    return { categories: mockCategories, items: mockMenus.filter(m => m.restaurantId === restaurantId) };
  }
};

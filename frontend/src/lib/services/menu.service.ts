import { apiFetch } from "@/lib/api/client";
import { mockCategories, mockMenus } from "@/data/mockMenus";
import type {
  MenuCategory,
  MenuItem,
} from "@/types/menu";

type BackendCategory = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

type BackendFood = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  categoryId:
    | string
    | {
        _id: string;
        name: string;
      };
  price: number;
  isAvailable: boolean;
  isVeg?: boolean;
  isPopular?: boolean;
  isSpecial?: boolean;
};

type MenuGroup = {
  category: BackendCategory;
  items: BackendFood[];
};

export const menuService = {
  async listByRestaurant(_restaurantId: string) {
    try {
      const groups = await apiFetch<MenuGroup[]>("/restaurant/menu");

      const categories: MenuCategory[] = groups.map((group) => ({
        id: group.category._id,
        name: group.category.name,
      }));

      const items: MenuItem[] = groups.flatMap((group) =>
        group.items.map((food) => ({
          id: food._id,
          restaurantId: _restaurantId,
          categoryId:
            typeof food.categoryId === "string"
              ? food.categoryId
              : food.categoryId._id,
          name: food.name,
          description: food.description || "",
          price: food.price,
          image:
            food.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
          isAvailable: food.isAvailable,
          isVeg: food.isVeg,
          popular: food.isPopular,
        }))
      );

      if (items.length === 0) {
        throw new Error("No menu items found in database, using mock menus.");
      }

      return {
        categories,
        items,
      };
    } catch (err) {
      console.warn("Using offline fallback menu for restaurant:", err);
      // Map mock categories and items for the restaurant (defaulting to r1 items if it doesn't match)
      const mappedItems = mockMenus
        .filter((m) => m.restaurantId === _restaurantId || _restaurantId === "r1")
        .map((m) => ({ ...m, restaurantId: _restaurantId }));
      
      const usedCategoryIds = new Set(mappedItems.map((m) => m.categoryId));
      const filteredCategories = mockCategories.filter((c) => usedCategoryIds.has(c.id));

      return {
        categories: filteredCategories.length > 0 ? filteredCategories : mockCategories,
        items: mappedItems,
      };
    }
  },

  async categories() {
    try {
      return await apiFetch<BackendCategory[]>("/restaurant/categories");
    } catch (err) {
      console.warn("Using offline fallback categories:", err);
      return mockCategories.map((c) => ({
        _id: c.id,
        name: c.name,
        isActive: true,
      }));
    }
  },
};
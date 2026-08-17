import { apiFetch } from "@/lib/api/client";
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
    const groups = await apiFetch<MenuGroup[]>(
      "/restaurant/menu"
    );

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

    return {
      categories,
      items,
    };
  },

  async categories() {
    return apiFetch<BackendCategory[]>(
      "/restaurant/categories"
    );
  },
};
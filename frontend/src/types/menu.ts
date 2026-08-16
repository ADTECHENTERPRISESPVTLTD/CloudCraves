export type MenuCategory = { id: string; name: string };
export type MenuItem = {
  id: string; restaurantId: string; categoryId: string; name: string;
  description: string; price: number; image: string; isAvailable: boolean;
  isVeg?: boolean; popular?: boolean;
};

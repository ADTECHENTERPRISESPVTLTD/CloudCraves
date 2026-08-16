import type { MenuCategory, MenuItem } from "@/types/menu";

export const mockCategories: MenuCategory[] = [
  { id: "cat1", name: "Breakfast" }, { id: "cat2", name: "Main Course" },
  { id: "cat3", name: "Breads" }, { id: "cat4", name: "Beverages" }
];

export const mockMenus: MenuItem[] = [
  { id: "m1", restaurantId: "r1", categoryId: "cat1", name: "Poha", description: "Fresh poha with peanuts, onion and coriander.", price: 60, image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80", isAvailable: true, isVeg: true, popular: true },
  { id: "m2", restaurantId: "r1", categoryId: "cat2", name: "Pithla Bhakri", description: "Traditional gram-flour curry served with bhakri.", price: 160, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80", isAvailable: true, isVeg: true, popular: true },
  { id: "m3", restaurantId: "r1", categoryId: "cat2", name: "Misal Pav", description: "Spicy sprout curry with farsan and pav.", price: 110, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", isAvailable: true, isVeg: true },
  { id: "m4", restaurantId: "r1", categoryId: "cat4", name: "Solkadhi", description: "Cool kokum and coconut drink.", price: 70, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80", isAvailable: true, isVeg: true },
  { id: "m5", restaurantId: "r2", categoryId: "cat2", name: "Paneer Tikka Masala", description: "Charred paneer in a rich tomato gravy.", price: 210, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", isAvailable: true, isVeg: true, popular: true },
  { id: "m6", restaurantId: "r2", categoryId: "cat3", name: "Butter Naan", description: "Soft tandoor naan brushed with butter.", price: 45, image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80", isAvailable: true, isVeg: true }
];

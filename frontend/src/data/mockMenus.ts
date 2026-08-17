import type { MenuCategory, MenuItem } from "@/types/menu";

export const mockCategories: MenuCategory[] = [
  { id: "cat1", name: "Breakfast" },
  { id: "cat2", name: "Main Course" },
  { id: "cat3", name: "Breads" },
  { id: "cat4", name: "Beverages" }
];

export const mockMenus: MenuItem[] = [
  // Aai's Kitchen (r1)
  {
    id: "m1",
    restaurantId: "r1",
    categoryId: "cat1",
    name: "Poha",
    description: "Fresh poha with peanuts, onion and coriander.",
    price: 60,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    popular: true
  },
  {
    id: "m2",
    restaurantId: "r1",
    categoryId: "cat2",
    name: "Pithla Bhakri",
    description: "Traditional gram-flour curry served with bhakri.",
    price: 160,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    popular: true
  },
  {
    id: "m3",
    restaurantId: "r1",
    categoryId: "cat2",
    name: "Misal Pav",
    description: "Spicy sprout curry with farsan and pav.",
    price: 110,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true
  },
  {
    id: "m4",
    restaurantId: "r1",
    categoryId: "cat4",
    name: "Solkadhi",
    description: "Cool kokum and coconut drink.",
    price: 70,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true
  },
  {
    id: "m7",
    restaurantId: "r1",
    categoryId: "cat1",
    name: "Kanda Bhaji",
    description: "Crispy fried onion pakoras served with green chutney.",
    price: 50,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true
  },
  {
    id: "m8",
    restaurantId: "r1",
    categoryId: "cat2",
    name: "Ukadiche Modak",
    description: "Sweet steamed rice flour dumplings stuffed with jaggery and grated coconut.",
    price: 90,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    popular: true
  },

  // Tadka Town (r2)
  {
    id: "m5",
    restaurantId: "r2",
    categoryId: "cat2",
    name: "Paneer Tikka Masala",
    description: "Charred paneer in a rich tomato gravy.",
    price: 210,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    popular: true
  },
  {
    id: "m6",
    restaurantId: "r2",
    categoryId: "cat3",
    name: "Butter Naan",
    description: "Soft tandoor naan brushed with butter.",
    price: 45,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true
  },
  {
    id: "m9",
    restaurantId: "r2",
    categoryId: "cat2",
    name: "Dal Tadka",
    description: "Yellow lentils tempered with ghee, garlic, and red chilies.",
    price: 140,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true
  },
  {
    id: "m10",
    restaurantId: "r2",
    categoryId: "cat3",
    name: "Garlic Naan",
    description: "Soft clay-oven flatbread flavored with minced garlic and butter.",
    price: 60,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true
  },

  // Gaon Zaika (r3)
  {
    id: "m12",
    restaurantId: "r3",
    categoryId: "cat2",
    name: "Chicken Sukka",
    description: "Dry spiced chicken cooked with desiccated coconut and spices.",
    price: 230,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: false,
    popular: true
  },
  {
    id: "m13",
    restaurantId: "r3",
    categoryId: "cat3",
    name: "Jowar Bhakri",
    description: "Traditional sorghum flatbread roasted on open fire.",
    price: 30,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true
  },
  {
    id: "m14",
    restaurantId: "r3",
    categoryId: "cat2",
    name: "Mutton Thali",
    description: "A complete rustic platter with Mutton Rassa, Sukka, two Bhakris, Rice, and Solkadhi.",
    price: 350,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: false,
    popular: true
  },
  {
    id: "m15",
    restaurantId: "r3",
    categoryId: "cat4",
    name: "Solkadhi",
    description: "Cooling digestif drink made from kokum and fresh coconut milk.",
    price: 70,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true
  }
];

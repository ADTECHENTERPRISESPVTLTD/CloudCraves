"use client";
import { create } from "zustand";
import type { MenuItem } from "@/types/menu";

export type CartLine = MenuItem & { quantity: number };
type CartState = {
  items: CartLine[];
  add: (item: MenuItem) => void; remove: (id: string) => void;
  clear: () => void; total: () => number;
};
export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: item => set(state => {
    const found = state.items.find(x => x.id === item.id);
    return { items: found ? state.items.map(x => x.id === item.id ? {...x, quantity: x.quantity + 1} : x) : [...state.items, {...item, quantity: 1}] };
  }),
  remove: id => set(state => ({ items: state.items.flatMap(x => x.id !== id ? [x] : x.quantity > 1 ? [{...x, quantity: x.quantity - 1}] : []) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, x) => sum + x.price * x.quantity, 0)
}));

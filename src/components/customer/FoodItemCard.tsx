"use client";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "@/types/menu";
import { useCart } from "@/lib/cart-store";
import { money } from "@/lib/utils";
export default function FoodItemCard({ item }: { item: MenuItem }) {
  const add = useCart(s => s.add), remove = useCart(s => s.remove), line = useCart(s => s.items.find(x => x.id === item.id));
  return <div className="card-kitchen flex gap-3 p-3 sm:p-4">
    <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"/>
    <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="font-extrabold">{item.name}</h3><p className="mt-1 text-sm text-[#6d625a]">{item.description}</p></div><span className="font-extrabold text-[#6b4f3a]">{money(item.price)}</span></div>
    <div className="mt-3">{item.isAvailable ? line ? <div className="flex w-fit items-center gap-2 rounded-xl bg-[#fff1e8] p-1"><button onClick={() => remove(item.id)} className="rounded-lg p-1 text-[#e4572e]" aria-label="Decrease quantity"><Minus size={16}/></button><b className="min-w-5 text-center">{line.quantity}</b><button onClick={() => add(item)} className="rounded-lg p-1 text-[#e4572e]" aria-label="Increase quantity"><Plus size={16}/></button></div> : <button className="btn-secondary py-2" onClick={() => add(item)}><Plus size={16}/> Add</button> : <span className="text-sm font-semibold text-[#b33b21]">Currently unavailable</span>}</div></div>
  </div>;
}

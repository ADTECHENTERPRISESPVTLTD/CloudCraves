"use client";
import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import CustomerShell from "@/components/layout/CustomerShell";
import FoodItemCard from "@/components/customer/FoodItemCard";
import StatusBadge from "@/components/ui/StatusBadge";
import RatingBadge from "@/components/ui/RatingBadge";
import { restaurantService } from "@/lib/services/restaurant.service";
import { menuService } from "@/lib/services/menu.service";
import type { Restaurant } from "@/types/restaurant";
import type { MenuCategory, MenuItem } from "@/types/menu";
import Link from "next/link";

export default function RestaurantPage() {
  const params=useParams<{id:string}>(); const [restaurant,setRestaurant]=useState<Restaurant|null>(null); const [cats,setCats]=useState<MenuCategory[]>([]); const [items,setItems]=useState<MenuItem[]>([]); const [active,setActive]=useState("");
  useEffect(()=>{ Promise.all([restaurantService.getById(params.id),menuService.listByRestaurant(params.id)]).then(([r,m])=>{setRestaurant(r);setCats(m.categories);setItems(m.items);setActive(m.categories[0]?.id||"");}); },[params.id]);
  if(!restaurant) return <CustomerShell><div className="container-kitchen py-16">Loading restaurant…</div></CustomerShell>;
  return <CustomerShell><div className="container-kitchen py-8"><div className="overflow-hidden rounded-[28px] bg-white shadow-sm"><img src={restaurant.image} alt={restaurant.name} className="h-60 w-full object-cover sm:h-80"/><div className="p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-black text-[#6b4f3a]">{restaurant.name}</h1><StatusBadge status="" open={restaurant.isOpen}/></div><p className="mt-2 text-[#6d625a]">{restaurant.cuisine} • {restaurant.distanceKm} km • {restaurant.deliveryMinutes} min</p><p className="mt-2 text-sm text-[#6d625a]">{restaurant.description}</p></div><RatingBadge rating={restaurant.rating}/></div><div className="mt-4 flex flex-wrap gap-2 text-sm text-[#6d625a]"><span>{restaurant.address}</span><span>•</span><span>{restaurant.hours}</span></div></div></div><div className="mt-8 flex gap-2 overflow-x-auto pb-2">{cats.map(c=><button key={c.id} onClick={()=>setActive(c.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${active===c.id?"bg-[#e4572e] text-white":"bg-white text-[#6b4f3a] border"}`}>{c.name}</button>)}</div><div className="mt-5 space-y-4">{items.filter(i=>i.categoryId===active).map(i=><FoodItemCard key={i.id} item={i}/>)}</div><Link href="/cart" className="btn-primary mt-7">View cart</Link></div></CustomerShell>;
}

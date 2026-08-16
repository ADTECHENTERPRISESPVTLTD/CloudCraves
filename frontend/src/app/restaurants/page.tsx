"use client";
import { useMemo, useState } from "react";
import CustomerShell from "@/components/layout/CustomerShell";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { mockRestaurants } from "@/data/mockRestaurants";

export default function RestaurantsPage() {
  const [q,setQ]=useState(""); const [cuisine,setCuisine]=useState("All"); const [openOnly,setOpenOnly]=useState(false);
  const cuisines=["All",...Array.from(new Set(mockRestaurants.map(r=>r.cuisine)))];
  const data=useMemo(()=>mockRestaurants.filter(r=>(!q || `${r.name} ${r.cuisine}`.toLowerCase().includes(q.toLowerCase())) && (cuisine==="All"||r.cuisine===cuisine) && (!openOnly||r.isOpen)),[q,cuisine,openOnly]);
  return <CustomerShell><div className="container-kitchen py-10"><h1 className="text-4xl font-black text-[#6b4f3a]">Find local restaurants</h1><p className="mt-2 text-[#6d625a]">Browse nearby kitchens by cuisine, rating and delivery.</p><div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]"><input className="input-kitchen" placeholder="Search restaurant or cuisine" value={q} onChange={e=>setQ(e.target.value)}/><select className="input-kitchen" value={cuisine} onChange={e=>setCuisine(e.target.value)}>{cuisines.map(x=><option key={x}>{x}</option>)}</select><button onClick={()=>setOpenOnly(!openOnly)} className={openOnly?"btn-primary":"btn-secondary"}>{openOnly?"Open only ✓":"Show open only"}</button></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</div>{data.length===0&&<div className="card-kitchen mt-8 p-10 text-center"><h2 className="font-extrabold">No nearby restaurants found</h2><p className="mt-2 text-[#6d625a]">Try another cuisine or search term.</p></div>}</div></CustomerShell>;
}

"use client";
import Link from "next/link";
import CustomerShell from "@/components/layout/CustomerShell";
import { useCart } from "@/lib/cart-store";
import PriceBreakdown from "@/components/customer/PriceBreakdown";
import { money } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const {items,add,remove,clear,total}=useCart(); const subtotal=total(); const delivery=items.length?30:0;
  return <CustomerShell><div className="container-kitchen py-10"><h1 className="text-4xl font-black text-[#6b4f3a]">Your cart</h1>{!items.length?<div className="card-kitchen mt-8 p-10 text-center"><h2 className="text-xl font-extrabold">Your cart is empty</h2><p className="mt-2 text-[#6d625a]">Add something delicious from a local kitchen.</p><Link href="/restaurants" className="btn-primary mt-5">Browse restaurants</Link></div>:<div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><div className="space-y-3">{items.map(x=><div key={x.id} className="card-kitchen flex items-center gap-3 p-4"><img src={x.image} alt={x.name} className="h-20 w-20 rounded-xl object-cover"/><div className="min-w-0 flex-1"><h3 className="font-extrabold">{x.name}</h3><p className="text-sm text-[#6d625a]">{money(x.price)} each</p></div><div className="flex items-center gap-1 rounded-xl bg-[#fff1e8] p-1"><button onClick={()=>remove(x.id)} className="p-1" aria-label="Decrease"><Minus size={16}/></button><b className="px-2">{x.quantity}</b><button onClick={()=>add(x)} className="p-1" aria-label="Increase"><Plus size={16}/></button></div><button onClick={()=>{for(let i=0;i<x.quantity;i++) remove(x.id)}} aria-label="Remove item"><Trash2 size={18} className="text-[#b33b21]"/></button></div>)}<button onClick={clear} className="text-sm font-bold text-[#b33b21]">Clear cart</button></div><aside className="card-kitchen h-fit p-5"><h2 className="text-xl font-black">Summary</h2><div className="mt-5"><PriceBreakdown subtotal={subtotal} deliveryFee={delivery}/></div><Link href="/checkout" className="btn-primary mt-6 w-full">Continue checkout</Link></aside></div>}</div></CustomerShell>;
}

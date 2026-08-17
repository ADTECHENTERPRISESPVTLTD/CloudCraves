"use client";
import Link from "next/link";
import { MapPin, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const count = useCart(s => s.items.reduce((a, x) => a + x.quantity, 0));
  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd2] bg-[#fff8ee]/95 backdrop-blur">
      <div className="container-kitchen flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black text-[#6b4f3a]">Local<span className="text-[#e4572e]">Bite</span></Link>
        <div className="hidden items-center gap-5 md:flex">
          <button className="flex items-center gap-2 text-sm font-semibold"><MapPin size={18} className="text-[#e4572e]"/> Hinjewadi, Pune</button>
          <Link href="/restaurants" className="text-sm font-semibold">Restaurants</Link>
          <Link href="/orders" className="text-sm font-semibold">My Orders</Link>
          <Link href="/profile" className="text-sm font-semibold">Profile</Link>
          <Link href="/cart" className="relative"><ShoppingBag size={22}/>{count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-[#e4572e] px-1.5 text-xs font-bold text-white">{count}</span>}</Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <div className="border-t border-[#eadfd2] bg-white p-4 md:hidden"><div className="container-kitchen flex flex-col gap-4 font-semibold"><Link href="/restaurants" onClick={() => setOpen(false)}>Restaurants</Link><Link href="/orders" onClick={() => setOpen(false)}>My Orders</Link><Link href="/profile" onClick={() => setOpen(false)}>Profile</Link><Link href="/cart" onClick={() => setOpen(false)}>Cart ({count})</Link></div></div>}
    </header>
  );
}

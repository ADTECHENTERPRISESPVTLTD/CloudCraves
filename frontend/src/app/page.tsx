import Link from "next/link";
import { Search, MapPin, ArrowRight, ShieldCheck, Bike } from "lucide-react";
import CustomerShell from "@/components/layout/CustomerShell";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { mockRestaurants } from "@/data/mockRestaurants";
import { mockMenus } from "@/data/mockMenus";
import { money } from "@/lib/utils";

export default function Home() {
  return <CustomerShell>
    <section className="bg-[#fff1e8] py-12 sm:py-16"><div className="container-kitchen grid items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
      <div><span className="rounded-full bg-[#f4c95d] px-3 py-1 text-xs font-black text-[#6b4f3a]">LOCAL FOOD • DIRECT ORDERING</span><h1 className="mt-5 text-4xl font-black leading-tight text-[#6b4f3a] sm:text-6xl">Good food from <span className="text-[#e4572e]">local kitchens.</span></h1><p className="mt-5 max-w-xl text-lg text-[#6d625a]">Discover nearby cloud kitchens and town restaurants, order directly, and get simple local delivery.</p>
      <div className="mt-7 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-lg"><MapPin className="ml-2 text-[#e4572e]"/><span className="flex-1 text-sm font-semibold">Hinjewadi, Pune</span><Link href="/restaurants" className="btn-primary">Find food <ArrowRight size={17}/></Link></div></div>
      <div className="overflow-hidden rounded-[28px] shadow-xl"><img src="https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=85" alt="Local Indian food" className="h-[330px] w-full object-cover sm:h-[420px]"/></div>
    </div></section>
    <section className="container-kitchen py-12"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-[#e4572e]">NEARBY</p><h2 className="text-3xl font-black text-[#6b4f3a]">Popular kitchens</h2></div><Link href="/restaurants" className="font-bold text-[#e4572e]">View all →</Link></div><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{mockRestaurants.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</div></section>
    <section className="bg-white py-12"><div className="container-kitchen grid gap-5 md:grid-cols-3"><div className="card-kitchen p-5"><ShieldCheck className="text-[#5c8d47]"/><h3 className="mt-3 font-extrabold">Direct & transparent</h3><p className="mt-1 text-sm text-[#6d625a]">Order directly from the kitchen with clear prices.</p></div><div className="card-kitchen p-5"><Bike className="text-[#e4572e]"/><h3 className="mt-3 font-extrabold">Simple local delivery</h3><p className="mt-1 text-sm text-[#6d625a]">Request home delivery and coordinate locally.</p></div><div className="card-kitchen p-5"><Search className="text-[#f28c28]"/><h3 className="mt-3 font-extrabold">Made for nearby food</h3><p className="mt-1 text-sm text-[#6d625a]">Find smaller kitchens not always listed on big marketplaces.</p></div></div></section>
    <section className="container-kitchen py-12"><h2 className="text-3xl font-black text-[#6b4f3a]">Popular items</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{mockMenus.filter(m=>m.popular).map(m=><Link key={m.id} href={`/restaurant/${m.restaurantId}`} className="card-kitchen overflow-hidden"><img src={m.image} alt={m.name} className="h-40 w-full object-cover"/><div className="p-4"><h3 className="font-extrabold">{m.name}</h3><p className="mt-1 text-sm text-[#6d625a]">{money(m.price)}</p></div></Link>)}</div></section>
  </CustomerShell>;
}

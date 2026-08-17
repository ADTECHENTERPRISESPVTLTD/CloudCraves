"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomerShell from "@/components/layout/CustomerShell";
import StatusBadge from "@/components/ui/StatusBadge";
import { orderService } from "@/lib/services/order.service";
import type { Order } from "@/types/order";
import { money } from "@/lib/utils";
export default function OrdersPage(){const [orders,setOrders]=useState<Order[]>([]);useEffect(()=>{orderService.list().then(setOrders)},[]);return <CustomerShell><div className="container-kitchen py-10"><h1 className="text-4xl font-black text-[#6b4f3a]">My Orders</h1><div className="mt-7 space-y-4">{orders.map(o=><Link href={`/orders/${o.id}`} key={o.id} className="card-kitchen block p-5 hover:shadow-lg"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="text-xs font-bold text-[#6d625a]">{o.orderNumber}</p><h2 className="mt-1 text-lg font-extrabold">{o.restaurantName}</h2><p className="mt-1 text-sm text-[#6d625a]">{o.items.map(i=>`${i.name} × ${i.quantity}`).join(", ")}</p></div><div className="flex items-center gap-3"><StatusBadge status={o.status}/><b>{money(o.total)}</b></div></div></Link>)}{!orders.length&&<div className="card-kitchen p-10 text-center"><h2 className="font-extrabold">No previous orders</h2></div>}</div></div></CustomerShell>}

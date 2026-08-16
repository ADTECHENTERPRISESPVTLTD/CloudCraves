import { money } from "@/lib/utils";
export default function PriceBreakdown({ subtotal, deliveryFee }: { subtotal: number; deliveryFee: number }) {
  return <div className="space-y-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span>Delivery fee</span><span>{money(deliveryFee)}</span></div><div className="border-t pt-3 text-base font-extrabold"><div className="flex justify-between"><span>Total</span><span>{money(subtotal + deliveryFee)}</span></div></div></div>;
}

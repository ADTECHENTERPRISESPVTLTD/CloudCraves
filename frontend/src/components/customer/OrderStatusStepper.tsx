import type { OrderStatus } from "@/types/order";
const steps: { key: OrderStatus; label: string }[] = [
  {key:"pending",label:"Placed"},{key:"accepted",label:"Accepted"},{key:"preparing",label:"Preparing"},{key:"ready",label:"Ready"},{key:"out_for_delivery",label:"Out for delivery"},{key:"delivered",label:"Delivered"}
];
export default function OrderStatusStepper({ status }: { status: OrderStatus }) {
  const index = steps.findIndex(s => s.key === status);
  return <div className="overflow-x-auto pb-2"><div className="flex min-w-[620px] items-start">{steps.map((step,i)=><div key={step.key} className="flex flex-1 items-start">{i>0 && <div className={`mt-3 h-1 flex-1 ${i<=index ? "bg-[#5c8d47]" : "bg-[#eadfd2]"}`}/>}<div className="w-28 text-center"><div className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i<=index ? "bg-[#5c8d47] text-white" : "bg-[#f3f1ec] text-[#6d625a]"}`}>{i+1}</div><p className="mt-2 text-xs font-semibold">{step.label}</p></div></div>)}</div></div>;
}

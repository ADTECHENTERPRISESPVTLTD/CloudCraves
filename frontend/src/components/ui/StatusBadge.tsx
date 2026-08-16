import { slugStatus } from "@/lib/utils";
export default function StatusBadge({ status, open }: { status: string; open?: boolean }) {
  const positive = open ?? ["accepted","preparing","ready","out_for_delivery","delivered","assigned","completed"].includes(status);
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${positive ? "badge-open" : "badge-closed"}`}>{open !== undefined ? (open ? "Open now" : "Closed") : slugStatus(status)}</span>;
}

export default function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="card-kitchen p-5"><p className="text-sm font-semibold text-[#6d625a]">{label}</p><p className="mt-2 text-3xl font-black text-[#6b4f3a]">{value}</p><p className="mt-1 text-xs text-[#6d625a]">{note}</p></div>;
}

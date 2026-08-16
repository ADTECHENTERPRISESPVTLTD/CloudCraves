export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return <div className="card-kitchen animate-pulse p-8 text-center text-sm font-semibold text-[#6d625a]">{label}</div>;
}
export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="card-kitchen p-10 text-center"><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm text-[#6d625a]">{text}</p></div>;
}
export function ErrorState({ text = "Unable to load this content." }: { text?: string }) {
  return <div className="rounded-2xl bg-[#f8e6e1] p-5 text-sm font-semibold text-[#b33b21]">{text}</div>;
}

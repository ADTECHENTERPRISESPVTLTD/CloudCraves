export default function RatingBadge({ rating }: { rating: number }) {
  return <span className="rounded-full bg-[#fff4cf] px-2.5 py-1 text-sm font-bold text-[#6b4f3a]">★ {rating.toFixed(1)}</span>;
}

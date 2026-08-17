import { slugStatus } from "@/lib/utils";

type Props = {
  status: string;
  open?: boolean;
};

export default function StatusBadge({ status, open }: Props) {
  if (open !== undefined) {
    return (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
          open ? "badge-open" : "badge-closed"
        }`}
      >
        {open ? "Open now" : "Closed"}
      </span>
    );
  }

  const normalizedStatus = status.toLowerCase();

  const positiveStatuses = [
    "accepted",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "assigned",
    "completed",
  ];

  const positive = positiveStatuses.includes(normalizedStatus);

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
        positive ? "badge-open" : "badge-closed"
      }`}
    >
      {slugStatus(normalizedStatus)}
    </span>
  );
}
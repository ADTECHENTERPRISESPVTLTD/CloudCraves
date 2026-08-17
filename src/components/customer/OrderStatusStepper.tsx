"use client";

import type { OrderStatus } from "@/types/order";

const steps: {
  key: OrderStatus;
  label: string;
}[] = [
  {
    key: "ACCEPTED",
    label: "Placed",
  },
  {
    key: "PREPARING",
    label: "Preparing",
  },
  {
    key: "READY",
    label: "Ready",
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
  },
];

type Props = {
  status: OrderStatus;
};

export default function OrderStatusStepper({
  status,
}: Props) {
  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex min-w-[600px] items-start">
        {steps.map((step, index) => {
          const completed =
            currentIndex >= index;

          const active =
            currentIndex === index;

          return (
            <div
              key={step.key}
              className="flex flex-1 items-start"
            >
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-black",
                    completed
                      ? "border-[#e4572e] bg-[#e4572e] text-white"
                      : "border-[#ddd5cc] bg-white text-[#8c8177]",
                  ].join(" ")}
                >
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                <span
                  className={[
                    "mt-2 whitespace-nowrap text-xs font-bold",
                    active
                      ? "text-[#e4572e]"
                      : "text-[#6d625a]",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={[
                    "mt-4 h-0.5 flex-1",
                    currentIndex > index
                      ? "bg-[#e4572e]"
                      : "bg-[#ddd5cc]",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
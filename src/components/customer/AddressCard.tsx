"use client";

import type { Address } from "@/types/user";

type Props = {
  address: Address;
  isDefault?: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onDefault: (id: string) => void;
};

export default function AddressCard({
  address,
  isDefault = false,
  onEdit,
  onDelete,
  onDefault,
}: Props) {
  const addressLines = [
    address.house,
    address.street,
    address.area,
    address.village,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-[#eee8df] bg-white p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f3f1ec] px-3 py-1 text-xs font-black text-[#6b4f3a]">
              {address.addressType || "Home"}
            </span>

            {isDefault && (
              <span className="rounded-full bg-[#e8f3e3] px-3 py-1 text-xs font-black text-[#5c8d47]">
                Default
              </span>
            )}
          </div>

          <h3 className="mt-3 font-black text-[#3f342c]">
            {address.name}
          </h3>

          <p className="mt-1 text-sm text-[#6d625a]">
            {address.phone}
          </p>

          <p className="mt-3 text-sm leading-6 text-[#6d625a]">
            {addressLines.join(", ")}
          </p>

          {address.landmark && (
            <p className="mt-2 text-sm text-[#6d625a]">
              <span className="font-bold">
                Landmark:
              </span>{" "}
              {address.landmark}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {!isDefault && (
            <button
              type="button"
              className="btn-secondary py-2"
              onClick={() => onDefault(address.id)}
            >
              Set default
            </button>
          )}

          <button
            type="button"
            className="btn-secondary py-2"
            onClick={() => onEdit(address)}
          >
            Edit
          </button>

          <button
            type="button"
            className="rounded-xl border border-[#f1c9c0] px-4 py-2 text-sm font-bold text-[#b33b21] transition hover:bg-[#fdf1ee]"
            onClick={() => onDelete(address.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
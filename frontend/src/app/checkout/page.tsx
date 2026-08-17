"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerShell from "@/components/layout/CustomerShell";
import PriceBreakdown from "@/components/customer/PriceBreakdown";
import { useCart } from "@/lib/cart-store";
import {
  profileService,
} from "@/lib/services/profile.service";
import {
  orderService,
} from "@/lib/services/order.service";
import {
  authService,
} from "@/lib/services/auth.service";

type Address = {
  id: string;
  label: string;
  address: string;
  landmark?: string;
  phone: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const { items, total, clear } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      router.push("/login");
      return;
    }

    profileService
      .get()
      .then((user) => {
        setAddresses(user.addresses);

        if (user.addresses.length > 0) {
          setAddressId(user.addresses[0].id);
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load addresses."
        );
      })
      .finally(() => setLoadingAddresses(false));
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!addressId) {
      setError("Please select a delivery address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const order = await orderService.create({
        items: items.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
        })),

        addressId,

        orderType: "DELIVERY",

        paymentMethod: "COD",

        discount: 0,
      });

      clear();

      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to place order."
      );
    } finally {
      setLoading(false);
    }
  }

  const subtotal = total();

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <h1 className="text-4xl font-black text-[#6b4f3a]">
          Checkout
        </h1>

        <form
          onSubmit={submit}
          className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"
        >
          <section className="card-kitchen p-5 sm:p-7">
            <h2 className="text-xl font-black">
              Delivery address
            </h2>

            {loadingAddresses ? (
              <div className="mt-5 animate-pulse rounded-xl bg-[#f3f1ec] p-6">
                Loading addresses...
              </div>
            ) : addresses.length === 0 ? (
              <div className="mt-5 rounded-xl bg-[#f8e6e1] p-4">
                <p className="text-sm font-semibold">
                  No saved address found.
                </p>

                <button
                  type="button"
                  className="btn-primary mt-4"
                  onClick={() => router.push("/profile")}
                >
                  Add address
                </button>
              </div>
            ) : (
              <div className="mt-5 grid gap-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`cursor-pointer rounded-2xl border p-4 ${
                      addressId === address.id
                        ? "border-[#e4572e] bg-[#fff1e8]"
                        : "border-[#eadfd2]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={addressId === address.id}
                      onChange={() =>
                        setAddressId(address.id)
                      }
                    />

                    <span className="ml-3 font-bold">
                      {address.label}
                    </span>

                    <p className="mt-2 text-sm text-[#6d625a]">
                      {address.address}
                    </p>

                    {address.landmark && (
                      <p className="mt-1 text-sm text-[#6d625a]">
                        Landmark: {address.landmark}
                      </p>
                    )}

                    <p className="mt-1 text-sm">
                      Phone: {address.phone}
                    </p>
                  </label>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl bg-[#f8e6e1] p-3 text-sm font-semibold text-[#b33b21]">
                {error}
              </div>
            )}
          </section>

          <aside className="card-kitchen h-fit p-5">
            <h2 className="text-xl font-black">
              Order summary
            </h2>

            <div className="mt-4 space-y-2 text-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <PriceBreakdown
                subtotal={subtotal}
                deliveryFee={30}
              />
            </div>

            <div className="mt-4 rounded-xl bg-[#f3f1ec] p-3 text-sm">
              <b>Payment:</b> Cash on Delivery
            </div>

            <button
              disabled={
                loading ||
                loadingAddresses ||
                !addressId ||
                !items.length
              }
              className="btn-primary mt-6 w-full disabled:opacity-60"
            >
              {loading
                ? "Placing order..."
                : "Place order"}
            </button>
          </aside>
        </form>
      </div>
    </CustomerShell>
  );
}
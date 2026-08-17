"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomerShell from "@/components/layout/CustomerShell";
import PriceBreakdown from "@/components/customer/PriceBreakdown";

import { checkoutSchema, type CheckoutValues } from "@/lib/validations";
import { useCart } from "@/lib/cart-store";

import {
  orderService,
  type CreateOrderPayload,
} from "@/lib/services/order.service";

import { addressService } from "@/lib/services/address.service";

import type { Address } from "@/types/user";

export default function CheckoutPage() {
  const router = useRouter();

  const { items, total, clear } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] =
    useState<string>("");

  const [loadingAddresses, setLoadingAddresses] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),

    defaultValues: {
      delivery: "home",
      payment: "cod",
    },
  });

  useEffect(() => {
    async function loadAddresses() {
      try {
        const result = await addressService.list();

        setAddresses(result);

        if (result.length > 0) {
          setSelectedAddressId(result[0].id);

          const address = result[0];

          setValue("name", address.name);
          setValue("phone", address.phone);

          setValue(
            "address",
            [
              address.house,
              address.street,
              address.area,
              address.village,
              address.city,
              address.state,
              address.pincode,
            ]
              .filter(Boolean)
              .join(", ")
          );

          setValue("landmark", address.landmark || "");
        }
      } catch {
        // User can still enter address manually.
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, [setValue]);

  useEffect(() => {
    const address = addresses.find(
      (item) => item.id === selectedAddressId
    );

    if (!address) {
      return;
    }

    setValue("name", address.name);
    setValue("phone", address.phone);

    setValue(
      "address",
      [
        address.house,
        address.street,
        address.area,
        address.village,
        address.city,
        address.state,
        address.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    );

    setValue("landmark", address.landmark || "");
  }, [selectedAddressId, addresses, setValue]);

  async function submit(values: CheckoutValues) {
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderItems = items.map((item) => ({
        foodId: item.id,
        quantity: item.quantity,
      }));

      const selectedAddress = addresses.find(
        (address) => address.id === selectedAddressId
      );

      const payload: CreateOrderPayload = {
        items: orderItems,

        orderType:
          values.delivery === "home"
            ? "DELIVERY"
            : "PICKUP",

        paymentMethod:
          values.payment === "cod"
            ? "COD"
            : "ONLINE",

        specialInstructions: "",
      };

      if (selectedAddress) {
        payload.addressId = selectedAddress.id;
      } else {
        payload.deliveryAddress = {
          name: values.name,
          phone: values.phone,
          house: values.address,
          street: "",
          area: values.address,
          village: "",
          city: "Local City",
          state: "Maharashtra",
          pincode: "000000",
          landmark: values.landmark || "",
          addressType: "Home",
        };
      }

      const order = await orderService.create(payload);

      clear();

      router.push(
        `/orders/${order.id || order.orderId}`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
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
          onSubmit={handleSubmit(submit)}
          className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"
        >
          <section className="card-kitchen p-5 sm:p-7">
            <h2 className="text-xl font-black">
              Delivery details
            </h2>

            {!loadingAddresses &&
              addresses.length > 0 && (
                <div className="mt-5">
                  <label className="block text-sm font-bold">
                    Saved address
                  </label>

                  <select
                    value={selectedAddressId}
                    onChange={(event) =>
                      setSelectedAddressId(
                        event.target.value
                      )
                    }
                    className="input-kitchen mt-1"
                  >
                    {addresses.map((address) => (
                      <option
                        key={address.id}
                        value={address.id}
                      >
                        {address.addressType ||
                          "Address"}{" "}
                        — {address.house},{" "}
                        {address.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-bold">
                Customer name

                <input
                  className="input-kitchen mt-1"
                  {...register("name")}
                />

                {errors.name && (
                  <span className="text-xs text-[#b33b21]">
                    {errors.name.message}
                  </span>
                )}
              </label>

              <label className="text-sm font-bold">
                Phone

                <input
                  className="input-kitchen mt-1"
                  inputMode="numeric"
                  {...register("phone")}
                />

                {errors.phone && (
                  <span className="text-xs text-[#b33b21]">
                    {errors.phone.message}
                  </span>
                )}
              </label>

              <label className="text-sm font-bold">
                Landmark

                <input
                  className="input-kitchen mt-1"
                  {...register("landmark")}
                />
              </label>

              <label className="sm:col-span-2 text-sm font-bold">
                Address

                <textarea
                  className="input-kitchen mt-1 min-h-28"
                  {...register("address")}
                />

                {errors.address && (
                  <span className="text-xs text-[#b33b21]">
                    {errors.address.message}
                  </span>
                )}
              </label>
            </div>

            <h2 className="mt-8 text-xl font-black">
              Delivery option
            </h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="rounded-2xl border p-4">
                <input
                  type="radio"
                  value="home"
                  {...register("delivery")}
                />

                <b className="ml-2">
                  Home Delivery
                </b>

                <p className="ml-6 text-sm text-[#6d625a]">
                  Request local delivery
                </p>
              </label>

              <label className="rounded-2xl border p-4">
                <input
                  type="radio"
                  value="pickup"
                  {...register("delivery")}
                />

                <b className="ml-2">
                  Pickup
                </b>

                <p className="ml-6 text-sm text-[#6d625a]">
                  Collect from kitchen
                </p>
              </label>
            </div>

            <h2 className="mt-8 text-xl font-black">
              Payment
            </h2>

            <label className="mt-3 block rounded-2xl border p-4">
              <input
                type="radio"
                value="cod"
                {...register("payment")}
              />

              <b className="ml-2">
                Cash on delivery / pickup
              </b>

              <p className="ml-6 text-sm text-[#6d625a]">
                Payment placeholder for prototype
              </p>
            </label>

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

            <button
              type="submit"
              disabled={loading}
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
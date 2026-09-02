"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerShell from "@/components/layout/CustomerShell";
import PriceBreakdown from "@/components/customer/PriceBreakdown";
import { useCart } from "@/lib/cart-store";
import { profileService } from "@/lib/services/profile.service";
import { orderService } from "@/lib/services/order.service";
import { authService } from "@/lib/services/auth.service";
import { MapPin, Plus, X, QrCode, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

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

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI">("COD");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Inline Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    house: "",
    street: "",
    area: "",
    village: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    addressType: "Home" as "Home" | "Work" | "Other",
  });

  const subtotal = total();
  const totalAmount = subtotal + 30; // subtotal + delivery fee

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      router.push("/login?redirect=/checkout");
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
        setError(err instanceof Error ? err.message : "Unable to load addresses.");
      })
      .finally(() => setLoadingAddresses(false));
  }, [router]);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    setSavingAddress(true);
    setError("");

    try {
      const updatedUser = await profileService.addAddress(newAddress);
      setAddresses(updatedUser.addresses);
      
      // Auto-select the newly added address
      if (updatedUser.addresses.length > 0) {
        const newlyAdded = updatedUser.addresses[updatedUser.addresses.length - 1];
        setAddressId(newlyAdded.id);
      }

      setShowAddressForm(false);
      setNewAddress({
        name: "",
        phone: "",
        house: "",
        street: "",
        area: "",
        village: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        addressType: "Home",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save address.");
    } finally {
      setSavingAddress(false);
    }
  }

  // Simulate UPI Payment Done
  function simulatePayment() {
    setVerifyingPayment(true);
    setError("");
    
    setTimeout(() => {
      setVerifyingPayment(false);
      setPaymentVerified(true);
    }, 2000);
  }

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

    if (paymentMethod === "UPI" && !paymentVerified) {
      setError("Please verify the UPI payment before placing your order.");
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
        paymentMethod: paymentMethod,
        discount: 0,
      });

      clear();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CustomerShell>
      <div className="container-kitchen py-10">
        <h1 className="text-4xl font-black text-[#6b4f3a]">Checkout</h1>

        <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Delivery Address Section */}
            <section className="card-kitchen p-5 sm:p-7">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-black">Delivery address</h2>
                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="btn-secondary py-2 inline-flex items-center gap-1.5 text-xs"
                  >
                    <Plus size={14} /> Add new address
                  </button>
                )}
              </div>

              {showAddressForm && (
                <div className="mb-6 p-5 border border-[#eadfd2] rounded-2xl bg-[#fffaf5] relative">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="absolute top-3 right-3 text-[#6d625a] p-1.5 hover:bg-[#eee4dc] rounded-lg"
                    aria-label="Close form"
                  >
                    <X size={18} />
                  </button>
                  <h3 className="font-extrabold text-[#6b4f3a] mb-4">New address details</h3>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      required
                      placeholder="Receiver's name"
                      className="input-kitchen"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    />
                    <input
                      required
                      placeholder="Phone number"
                      pattern="[6-9][0-9]{9}"
                      className="input-kitchen"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    />
                    <input
                      required
                      placeholder="House / Flat No."
                      className="input-kitchen"
                      value={newAddress.house}
                      onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                    />
                    <input
                      placeholder="Street / Lane"
                      className="input-kitchen"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    />
                    <input
                      required
                      placeholder="Area / Locality"
                      className="input-kitchen"
                      value={newAddress.area}
                      onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                    />
                    <input
                      placeholder="Village / Town (Optional)"
                      className="input-kitchen"
                      value={newAddress.village}
                      onChange={(e) => setNewAddress({ ...newAddress, village: e.target.value })}
                    />
                    <input
                      required
                      placeholder="City"
                      className="input-kitchen"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                    <input
                      required
                      placeholder="State"
                      className="input-kitchen"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                    <input
                      required
                      placeholder="Pincode"
                      pattern="[0-9]{6}"
                      className="input-kitchen"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    />
                    <input
                      placeholder="Landmark"
                      className="input-kitchen"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                    />
                    <select
                      className="input-kitchen sm:col-span-2"
                      value={newAddress.addressType}
                      onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value as any })}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>

                    <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="btn-secondary py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        disabled={savingAddress}
                        className="btn-primary py-2"
                      >
                        {savingAddress ? "Saving..." : "Save Address"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {loadingAddresses ? (
                <div className="animate-pulse rounded-xl bg-[#f3f1ec] p-6">
                  Loading addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="rounded-xl bg-[#fdf1ee] border border-[#f1c9c0] p-4 text-center">
                  <p className="text-sm font-bold text-[#b33b21]">No saved addresses found.</p>
                  <p className="text-xs text-[#6d625a] mt-1">Please add a delivery address to place your order.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`cursor-pointer rounded-2xl border p-4 block transition ${
                        addressId === address.id
                          ? "border-[#e4572e] bg-[#fff1e8]"
                          : "border-[#eadfd2]"
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          className="mt-1"
                          value={address.id}
                          checked={addressId === address.id}
                          onChange={() => setAddressId(address.id)}
                        />

                        <div className="ml-3">
                          <span className="font-bold text-[#6b4f3a]">
                            {address.label}
                          </span>

                          <p className="mt-2 text-sm text-[#6d625a]">
                            {address.address}
                          </p>

                          {address.landmark && (
                            <p className="mt-1 text-xs text-[#8c8177]">
                              Landmark: {address.landmark}
                            </p>
                          )}

                          <p className="mt-1 text-xs font-semibold text-[#6d625a]">
                            Phone: {address.phone}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </section>

            {/* Payment Options Section */}
            <section className="card-kitchen p-5 sm:p-7">
              <h2 className="text-xl font-black mb-5">Select Payment Method</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <label
                  className={`cursor-pointer rounded-2xl border p-4 flex items-center gap-3 transition ${
                    paymentMethod === "COD" ? "border-[#e4572e] bg-[#fff1e8]" : "border-[#eadfd2]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  <div>
                    <p className="font-bold text-[#6b4f3a]">Cash on Delivery</p>
                    <p className="text-xs text-[#6d625a]">Pay in cash upon food arrival</p>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-2xl border p-4 flex items-center gap-3 transition ${
                    paymentMethod === "UPI" ? "border-[#e4572e] bg-[#fff1e8]" : "border-[#eadfd2]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                  />
                  <div className="flex items-center gap-2">
                    <QrCode size={20} className="text-[#e4572e]" />
                    <div>
                      <p className="font-bold text-[#6b4f3a]">UPI Scanner</p>
                      <p className="text-xs text-[#6d625a]">Scan QR code & pay online</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* UPI Scanner Simulator */}
              {paymentMethod === "UPI" && (
                <div className="mt-6 border border-[#eadfd2] bg-[#fffaf5] p-5 rounded-2xl text-center">
                  <h3 className="font-extrabold text-[#6b4f3a] text-sm">Scan QR Code to Pay</h3>
                  <p className="text-xs text-[#6d625a] mt-1 max-w-sm mx-auto">
                    Scan this QR code using any UPI app (GPay, PhonePe, Paytm, BHIM) to pay <b>₹{totalAmount}</b>.
                  </p>

                  {/* Pure CSS Premium QR Code mockup */}
                  <div className="mx-auto my-5 flex h-48 w-48 flex-col items-center justify-center rounded-2xl border-4 border-[#6b4f3a] bg-white p-3 shadow-md">
                    <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-1.5 p-1">
                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>

                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>

                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-[#e4572e] rounded-full flex items-center justify-center text-[10px] font-black text-white">LB</div>
                      <div className="bg-transparent"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>

                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>

                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                      <div className="bg-[#6b4f3a] rounded-sm"></div>
                    </div>
                  </div>

                  <div className="mt-3 max-w-sm mx-auto">
                    {verifyingPayment ? (
                      <button
                        type="button"
                        disabled
                        className="btn-secondary w-full py-2.5 inline-flex items-center justify-center gap-2"
                      >
                        <Loader2 size={16} className="animate-spin text-[#e4572e]" />
                        Verifying UPI Transaction...
                      </button>
                    ) : paymentVerified ? (
                      <div className="bg-[#e9f5e9] border border-[#357a38]/30 rounded-xl p-3 inline-flex items-center gap-2 text-[#357a38] text-sm font-bold w-full justify-center">
                        <CheckCircle2 size={18} className="fill-[#357a38] text-white" />
                        ✓ Payment Verified Successfully!
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={simulatePayment}
                        className="btn-primary w-full py-2.5 inline-flex items-center justify-center gap-2 bg-[#5c8d47] hover:bg-[#497037]"
                      >
                        <ShieldCheck size={18} />
                        Simulate Payment Done (Pay ₹{totalAmount})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="card-kitchen h-fit p-5">
            <h2 className="text-xl font-black">Order summary</h2>

            <div className="mt-4 space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <span className="text-[#6d625a]">
                    {item.name} × {item.quantity}
                  </span>
                  <b>₹{item.price * item.quantity}</b>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <PriceBreakdown subtotal={subtotal} deliveryFee={30} />
            </div>

            <div className="mt-4 border-t border-[#eee8df] pt-4">
              <div className="flex justify-between text-lg">
                <span className="font-black text-[#6b4f3a]">Total</span>
                <span className="font-black text-[#e4572e]">₹{totalAmount}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#f3f1ec] p-3 text-xs leading-5">
              <span className="font-bold text-[#6d625a]">Payment method:</span>{" "}
              <b className="text-[#3f342d]">
                {paymentMethod === "COD" ? "Cash on Delivery" : "UPI Online"}
              </b>
              {paymentMethod === "UPI" && (
                <span className={`block font-bold mt-0.5 ${paymentVerified ? "text-[#357a38]" : "text-[#b33b21]"}`}>
                  Status: {paymentVerified ? "Paid & Verified" : "Verification Pending"}
                </span>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-[#f8e6e1] p-3 text-xs font-semibold text-[#b33b21]">
                {error}
              </div>
            )}

            <button
              disabled={
                loading ||
                loadingAddresses ||
                !addressId ||
                !items.length ||
                (paymentMethod === "UPI" && !paymentVerified)
              }
              className="btn-primary mt-6 w-full disabled:opacity-60"
            >
              {loading ? "Placing order..." : "Place order"}
            </button>
          </aside>
        </form>
      </div>
    </CustomerShell>
  );
}
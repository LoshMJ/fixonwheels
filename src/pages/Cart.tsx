import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import CartCornerAnimation from "../components/ui/CartCornerAnimation";
import { api } from "../services/api";

type PayMethod = "cod" | "paypal" | "card";

type Address = {
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  district: string;
  postalCode: string;
};

export default function Cart() {
  const { items, changeQty, removeFromCart, clearCart } = useCart();

  // ✅ selection for calculating totals
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ✅ Address + Payment UI states
  const [showAddress, setShowAddress] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [method, setMethod] = useState<PayMethod | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // ✅ Address fields
  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    district: "",
    postalCode: "",
  });
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  // Card fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Paypal field (optional simple)
  const [paypalEmail, setPaypalEmail] = useState("");

  useEffect(() => {
    setSelectedIds(new Set(items.map((x) => x.cartItemId)));
  }, [items]);

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedItems = useMemo(
    () => items.filter((x) => selectedIds.has(x.cartItemId)),
    [items, selectedIds]
  );

  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, x) => sum + x.qty, 0),
    [selectedItems]
  );

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, x) => sum + x.price * x.qty, 0),
    [selectedItems]
  );

  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((x) => x.cartItemId)));
  };

  // ✅ When checkout clicked → open ADDRESS first
  const onCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to place an order.");
      window.location.href = "/login";
      return;
    }
    if (selectedIds.size === 0) return;

    setOrderConfirmed(false);

    // reset steps
    setShowPayment(false);
    setMethod(null);

    setShowAddress(true);
    setAddressConfirmed(false);
  };

  // ✅ Address validation
  const canContinueAddress = useMemo(() => {
    if (!showAddress) return false;

    const phoneOk = address.phone.trim().length >= 9; // simple check
    const postalOk = address.postalCode.trim().length >= 4;

    return (
      address.fullName.trim().length >= 2 &&
      phoneOk &&
      address.address1.trim().length >= 4 &&
      address.city.trim().length >= 2 &&
      address.district.trim().length >= 2 &&
      postalOk
    );
  }, [address, showAddress]);

  const onContinueToPayment = () => {
    if (!canContinueAddress) return;

    setAddressConfirmed(true);
    setShowAddress(false);

    setShowPayment(true);
    // keep current method if user already selected, else null
    if (!method) setMethod(null);
  };

  // ✅ Validate payment before enabling Pay button
  const canPay = useMemo(() => {
    if (!showPayment || !method) return false;
    if (selectedIds.size === 0) return false;

    // must have address first
    if (!addressConfirmed) return false;

    if (method === "cod") return true;

    if (method === "paypal") {
      return paypalEmail.trim().length > 0;
    }

    // card
    const n = cardNumber.replace(/\s/g, "");
    const expOk = /^[0-9]{2}\/[0-9]{2}$/.test(cardExp.trim());
    return (
      cardName.trim().length >= 2 &&
      n.length >= 12 &&
      expOk &&
      cardCvv.trim().length >= 3
    );
  }, [
    showPayment,
    method,
    selectedIds.size,
    cardName,
    cardNumber,
    cardExp,
    cardCvv,
    paypalEmail,
    addressConfirmed,
  ]);

  // ✅ Confirm order
  const onPay = async () => {
    if (!canPay || !method) return;

    setIsPaying(true);
    setOrderConfirmed(false);

    try {
      await api("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: selectedItems.map((x) => ({
            productId: x.productId,
            title: x.title,
            price: x.price,
            qty: x.qty,
            img: x.image,
            model: x.options.model,
            color: x.options.color,
          })),
          total: selectedTotal,
          paymentMethod: method,

          // ✅ send address to backend (you can store later in DB)
          address: {
            fullName: address.fullName,
            phone: address.phone,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            district: address.district,
            postalCode: address.postalCode,
          },
        }),
      });

      // remove selected items
      selectedItems.forEach((x) => removeFromCart(x.cartItemId));
      setSelectedIds(new Set());

      setOrderConfirmed(true);

      // close steps
      setShowPayment(false);
      setShowAddress(false);
      setMethod(null);
      setAddressConfirmed(false);

      // reset fields
      setAddress({
        fullName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        district: "",
        postalCode: "",
      });

      setCardName("");
      setCardNumber("");
      setCardExp("");
      setCardCvv("");
      setPaypalEmail("");
    } catch (e: any) {
      alert(e.message || "Checkout failed");
    } finally {
      setIsPaying(false);
    }
  };

  const PaymentOptionCard = ({
    value,
    title,
    desc,
  }: {
    value: PayMethod;
    title: string;
    desc: string;
  }) => {
    const active = method === value;
    return (
      <button
        type="button"
        onClick={() => setMethod(value)}
        className={`w-full text-left rounded-xl border p-4 transition ${
          active
            ? "border-purple-600 bg-purple-50"
            : "border-gray-200 bg-white hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-gray-600 mt-1">{desc}</p>
          </div>
          <div
            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
              active ? "border-purple-600" : "border-gray-300"
            }`}
          >
            {active ? <div className="h-2 w-2 rounded-full bg-purple-600" /> : null}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="pt-24">
      <div className="relative">
        {/* animation in right corner */}
        <CartCornerAnimation />

        <div className="max-w-6xl mx-auto px-6 py-10 text-black">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Cart</h1>
              <p className="text-sm text-gray-600 mt-1">
                Selected Items: <b>{selectedCount}</b> • Selected Total:{" "}
                <b>RS. {selectedTotal.toLocaleString()}</b>
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setSelectedIds(new Set());
                  setShowAddress(false);
                  setShowPayment(false);
                  setMethod(null);
                  setOrderConfirmed(false);
                  setAddressConfirmed(false);
                }}
                className="btn-clear"
              >
                Clear Cart
              </button>
            )}
          </div>

          {orderConfirmed && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
              ✅ Order confirmed! Thank you for your purchase.
            </div>
          )}

          {items.length === 0 ? (
            <div className="mt-8 p-6 rounded-xl border bg-white">Cart is empty.</div>
          ) : (
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {/* Items */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                  <span>Select all</span>
                </div>

                {items.map((x) => (
                  <div
                    key={x.cartItemId}
                    className="bg-white border rounded-xl p-4 flex gap-4"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(x.cartItemId)}
                      onChange={() => toggle(x.cartItemId)}
                      className="mt-2"
                    />

                    <img
                      src={x.image}
                      alt={x.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{x.title}</h3>

                          <div className="text-xs text-gray-600 mt-1">
                            <span className="mr-3">
                              Color: <b>{x.options.color}</b>
                            </span>
                            {x.options.model && (
                              <span>
                                Model: <b>{x.options.model}</b>
                              </span>
                            )}
                          </div>

                          <p className="mt-2 font-semibold text-purple-700">
                            RS. {x.price.toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(x.cartItemId)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <label className="text-sm text-gray-600">Qty</label>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={x.qty}
                          onChange={(e) => changeQty(x.cartItemId, Number(e.target.value))}
                          className="w-20 border rounded-lg px-2 py-1"
                        />

                        <div className="ml-auto text-sm text-gray-700">
                          Subtotal: <b>RS. {(x.price * x.qty).toLocaleString()}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary + Address + Payment */}
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-white border rounded-xl p-5 h-fit">
                  <h2 className="font-bold text-lg">Summary</h2>
                  <div className="mt-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Selected items</span>
                      <b>{selectedCount}</b>
                    </div>
                    <div className="flex justify-between">
                      <span>Selected total</span>
                      <b>RS. {selectedTotal.toLocaleString()}</b>
                    </div>
                  </div>

                  <button
                    disabled={selectedIds.size === 0}
                    onClick={onCheckout}
                    className={`mt-5 w-full py-2 rounded-lg text-sm font-medium transition ${
                      selectedIds.size === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-black text-white hover:opacity-90"
                    }`}
                  >
                    Checkout
                  </button>
                </div>

                {/* ✅ ADDRESS SECTION (Before Payment) */}
                {showAddress && (
                  <div className="bg-white border rounded-xl p-5">
                    <h3 className="font-bold text-lg">Delivery Address</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Enter your address details to continue payment.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                          value={address.fullName}
                          onChange={(e) =>
                            setAddress((p) => ({ ...p, fullName: e.target.value }))
                          }
                          placeholder="Your name"
                          className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <input
                          value={address.phone}
                          onChange={(e) =>
                            setAddress((p) => ({ ...p, phone: e.target.value }))
                          }
                          placeholder="07XXXXXXXX"
                          className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Address Line 1</label>
                        <input
                          value={address.address1}
                          onChange={(e) =>
                            setAddress((p) => ({ ...p, address1: e.target.value }))
                          }
                          placeholder="House no, street, area"
                          className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Address Line 2 (optional)</label>
                        <input
                          value={address.address2 || ""}
                          onChange={(e) =>
                            setAddress((p) => ({ ...p, address2: e.target.value }))
                          }
                          placeholder="Apartment, landmark"
                          className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium">City</label>
                          <input
                            value={address.city}
                            onChange={(e) =>
                              setAddress((p) => ({ ...p, city: e.target.value }))
                            }
                            placeholder="City"
                            className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">District</label>
                          <input
                            value={address.district}
                            onChange={(e) =>
                              setAddress((p) => ({ ...p, district: e.target.value }))
                            }
                            placeholder="District"
                            className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Postal Code</label>
                        <input
                          value={address.postalCode}
                          onChange={(e) =>
                            setAddress((p) => ({ ...p, postalCode: e.target.value }))
                          }
                          placeholder="Postal code"
                          className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!canContinueAddress}
                      onClick={onContinueToPayment}
                      className={`mt-5 w-full py-2 rounded-lg text-sm font-medium transition ${
                        !canContinueAddress
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white hover:opacity-90"
                      }`}
                    >
                      Continue to Payment
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAddress(false);
                        setAddressConfirmed(false);
                      }}
                      className="mt-3 w-full py-2 rounded-lg text-sm font-medium border hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Payment Section (After Address) */}
                {showPayment && (
                  <div className="bg-white border rounded-xl p-5">
                    <h3 className="font-bold text-lg">Payment</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Choose a payment method to confirm your order.
                    </p>

                    <div className="mt-4 space-y-3">
                      <PaymentOptionCard
                        value="cod"
                        title="Cash on Delivery"
                        desc="Pay when the item is delivered to your doorstep."
                      />
                      <PaymentOptionCard
                        value="paypal"
                        title="PayPal"
                        desc="Pay securely using your PayPal account."
                      />
                      <PaymentOptionCard
                        value="card"
                        title="Card Payment"
                        desc="Visa / MasterCard / Debit card payments."
                      />
                    </div>

                    {/* Conditional Forms */}
                    {method === "paypal" && (
                      <div className="mt-4">
                        <label className="text-sm font-medium">PayPal Email</label>
                        <input
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          placeholder="example@gmail.com"
                          className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    )}

                    {method === "card" && (
                      <div className="mt-4 grid grid-cols-1 gap-3">
                        <div>
                          <label className="text-sm font-medium">Cardholder Name</label>
                          <input
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Name on card"
                            className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Card Number</label>
                          <input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium">Expiry (MM/YY)</label>
                            <input
                              value={cardExp}
                              onChange={(e) => setCardExp(e.target.value)}
                              placeholder="08/28"
                              className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">CVV</label>
                            <input
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="123"
                              className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={!canPay || isPaying}
                      onClick={onPay}
                      className={`mt-5 w-full py-2 rounded-lg text-sm font-medium transition ${
                        !canPay || isPaying
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-purple-700 text-white hover:opacity-90"
                      }`}
                    >
                      {isPaying ? "Processing..." : "Pay"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPayment(false);
                        setMethod(null);

                        // go back to address step
                        setShowAddress(true);
                        setAddressConfirmed(false);
                      }}
                      className="mt-3 w-full py-2 rounded-lg text-sm font-medium border hover:bg-gray-50"
                    >
                      Back to Address
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
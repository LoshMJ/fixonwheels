// src/components/repair/Step5.tsx
import { useState, useEffect } from "react";
import SpinningCard from "../ui/Card";
import { findDeviceByModel, findIssueByLabel } from "./repairWorkflows";
import { getSession } from "../../lib/auth"; // ← STEP 3: added import

type PaymentMethod = "card" | "cash" | "paypal";
type PaymentStatus = "idle" | "processing" | "success";

interface Step5Props {
  selectedModel: string | null;
  selectedIssue: string | null;
  pricing: { repair: number; travel: number; total: number } | null;
  repairId: string | null; // ← STEP 1: added repairId prop
}

export default function Step5({
  selectedModel,
  selectedIssue,
  pricing,
  repairId,
}: Step5Props) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [paypalEmail, setPaypalEmail] = useState("");

  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingNote, setRatingNote] = useState("");

  useEffect(() => {
    // reset when job changes
    setMethod("card");
    setPaymentStatus("idle");
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPaypalEmail("");
    setLoyaltyPoints(null);
    setRating(0);
    setRatingNote("");
  }, [selectedModel, selectedIssue, pricing?.total]);

  const deviceMeta = findDeviceByModel(selectedModel || "");
  const issueMeta = findIssueByLabel(selectedIssue || "");

  const total = pricing?.total ?? 0;
  const computedPoints =
    total > 0 ? Math.max(2, Math.round(total * 0.02)) : 2; // at least 2 pts

  const canSubmit =
    method === "cash"
      ? true
      : method === "card"
      ? !!cardName && !!cardNumber && !!cardExpiry && !!cardCvc
      : !!paypalEmail;



  // 🔥 STEP 4 — Real backend payment call
const handlePay = async () => {
  if (!canSubmit || paymentStatus === "processing") return;

  const session = getSession();
  if (!session?.token || !repairId) {
    alert("Missing session or repair ID. Please try again.");
    return;
  }

  try {
    setPaymentStatus("processing");

    const backendMethod = method === "cash" ? "cod" : method;

    const res = await fetch(
      `http://localhost:5000/api/repairs/${repairId}/pay`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          method: backendMethod,
          amount: total,   // 🔥 THIS WAS MISSING
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Payment failed");
    }

await res.json();
    setPaymentStatus("success");
    setLoyaltyPoints(computedPoints);

    alert("Payment processed successfully!");

  } catch (err: any) {
    console.error("Payment error:", err);
    alert(err.message || "Payment failed. Please try again.");
    setPaymentStatus("idle");
  }
};

  const renderMethodFields = () => {
    if (method === "cash") {
      return (
        <div className="space-y-3 text-sm text-white/80">
          <p>
            You&apos;ve selected{" "}
            <span className="font-semibold text-white">
              Cash on delivery
            </span>
            .
          </p>
          <p className="text-white/70 text-xs">
            You&apos;ll pay the technician once your device is delivered back
            to you. They&apos;ll confirm the payment on their panel and you&apos;ll
            see a confirmation here.
          </p>
          <div className="mt-2 rounded-2xl bg-black/60 border border-emerald-400/50 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-white/60">
              Total due on delivery
            </span>
            <span className="text-lg font-semibold text-emerald-300">
              ${total.toFixed(2)}
            </span>
          </div>
          {paymentStatus === "success" && (
            <p className="text-[11px] text-emerald-200/90">
              Payment marked as received by technician. Thank you!
            </p>
          )}
        </div>
      );
    }

    if (method === "paypal") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
              PayPal email
            </label>
            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
            />
          </div>
          <p className="text-[11px] text-white/50">
            We&apos;ll open a secure PayPal flow in production. For now this is
            a front-end preview only.
          </p>
        </div>
      );
    }

    // CARD
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
              Cardholder name
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Name on card"
              className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
              Card number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
                Expiry
              </label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
                CVC
              </label>
              <input
                type="password"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                placeholder="***"
                className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
              />
            </div>
          </div>
        </div>

        {/* spinning card component just for card payments */}
        <div className="mt-2 flex justify-start">
          <SpinningCard />
        </div>

        <p className="text-[11px] text-white/50">
          This is a visual preview. In production this will connect to your real
          payment gateway (Stripe / PayPal / bank).
        </p>
      </div>
    );
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base">
      {/* LEFT: payment method + inputs */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">
            Payment method
          </p>

          <div className="space-y-1 text-xs text-white/80 mb-2">
            <p>
              <span className="text-white/60">Device:</span>{" "}
              {deviceMeta?.displayName || selectedModel || "—"}
            </p>
            <p>
              <span className="text-white/60">Issue:</span>{" "}
              {issueMeta?.label || selectedIssue || "—"}
            </p>
            <p>
              <span className="text-white/60">Technician:</span>{" "}
              Alex Carter
            </p>
          </div>

          {/* method selector */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black/40 p-1 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setMethod("card")}
              className={`px-3 py-1.5 rounded-full transition ${
                method === "card"
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={() => setMethod("cash")}
              className={`px-3 py-1.5 rounded-full transition ${
                method === "cash"
                  ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              Cash on delivery
            </button>
            <button
              type="button"
              onClick={() => setMethod("paypal")}
              className={`px-3 py-1.5 rounded-full transition ${
                method === "paypal"
                  ? "bg-sky-500 text-black shadow-[0_0_12px_rgba(56,189,248,0.7)]"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              PayPal
            </button>
          </div>

          <div className="mt-3">{renderMethodFields()}</div>

          {/* total row */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-xs text-white/60">Order total</span>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">
                ${total.toFixed(2)}
              </p>
              <p className="text-[10px] text-white/40">
                Repair + travel · no hidden fees
              </p>
            </div>
          </div>

          {/* pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={!canSubmit || paymentStatus === "processing"}
            className={`mt-3 w-full px-4 py-2.5 rounded-full text-xs font-semibold transition flex items-center justify-center gap-2 ${
              canSubmit && paymentStatus !== "processing"
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_18px_rgba(168,85,247,0.8)]"
                : "bg-purple-900/40 text-white/40 cursor-not-allowed"
            }`}
          >
            {paymentStatus === "processing" ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
                Processing payment…
              </>
            ) : method === "cash" ? (
              "Mark as will pay on delivery"
            ) : (
              "Confirm payment"
            )}
          </button>

          {paymentStatus === "success" && (
            <p className="mt-2 text-[11px] text-emerald-200/90">
              Payment confirmed. A receipt will appear in your account and a
              notification is sent to your device.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: loyalty + rating */}
      <div className="flex flex-col gap-4">
        {/* loyalty points */}
        <div className="rounded-2xl bg-black/70 border border-emerald-400/60 px-5 py-4 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/90 mb-2">
            Loyalty & rewards
          </p>

          <p className="text-sm text-white/80">
            For this repair you&apos;ll earn{" "}
            <span className="font-semibold text-emerald-200">
              {loyaltyPoints ?? computedPoints} pts
            </span>{" "}
            towards future discounts.
          </p>

          <p className="text-[11px] text-white/50 mt-2">
            Points unlock priority support and % discounts on your next
            FixOnWheels repair.
          </p>

          {paymentStatus !== "success" && (
            <p className="text-[11px] text-amber-200/80 mt-2">
              Confirm payment to actually credit these points to your profile.
            </p>
          )}
        </div>

        {/* rating card */}
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            Rate your technician
          </p>

          <p className="text-xs text-white/70">
            Help us keep quality high for every repair. This feedback is shared
            with{" "}
            <span className="font-semibold text-white">
              Alex Carter
            </span>{" "}
            and our support team.
          </p>

          {/* stars */}
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = rating >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <span
                    className={`text-xl ${
                      active ? "text-yellow-300" : "text-white/30"
                    }`}
                  >
                    ★
                  </span>
                </button>
              );
            })}
            {rating > 0 && (
              <span className="ml-2 text-xs text-white/70">
                {rating}/5 stars
              </span>
            )}
          </div>

          {/* note */}
          <textarea
            value={ratingNote}
            onChange={(e) => setRatingNote(e.target.value)}
            rows={3}
            className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60 resize-none"
            placeholder="Anything you loved or anything we should improve?"
          />

<button
  type="button"
  onClick={async () => {
    if (!repairId) return;
    const session = getSession();
    if (!session?.token) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/repairs/${repairId}/rate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            rating,
            note: ratingNote,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save rating");

      alert("Rating saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save rating");
    }
  }}
  className="self-start mt-1 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-semibold transition"
>
  Save feedback
</button>

          {paymentStatus === "success" && (
            <p className="text-[11px] text-emerald-200/90 mt-1">
              Thanks! Your rating and notes are saved with this job.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { getSession } from "../../utils/auth";
import io from "socket.io-client";

interface Repair {
  _id: string;
  deviceModel: string;
  issue: string;
  customer: string;
  amount: number;
  paidAt?: string;  // 🔥 ADD THIS
  paymentMethod?: "card" | "paypal" | "cod";
  paymentStatus?: "pending" | "awaiting_payment" | "paid";
  status: string;
}
console.log("TechnicianPayments file loaded");
export default function TechnicianPayments() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const session = getSession();

  useEffect(() => {
    if (!session?.token) return;

fetch("http://localhost:5000/api/repairs/payments", {
          headers: {
        Authorization: `Bearer ${session.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const paymentRepairs = data.filter(
          (r: Repair) =>
            r.status === "awaiting_payment" || r.status === "paid"
        );
        setRepairs(paymentRepairs);
      });
  }, []);

useEffect(() => {
  const socket = io("http://localhost:5000");

socket.on("repair_updated", (updatedRepair: Repair) => {
      setRepairs(prev =>
      prev.map(r =>
        r._id === updatedRepair._id ? updatedRepair : r
      )
    );
  });

  return () => {
    socket.disconnect();
  };
}, []);
const confirmCash = async (repairId: string) => {
  if (!session?.token) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/repairs/${repairId}/confirm-cash`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to confirm cash");

    const updated = await res.json();

    // 🔥 Update table instantly
    setRepairs(prev =>
      prev.map(r =>
        r._id === repairId ? updated : r
      )
    );

  } catch (err) {
    console.error(err);
    alert("Failed to confirm cash");
  }
};
const confirmPayment = async (repairId: string) => {
  if (!session?.token) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/repairs/${repairId}/confirm-payment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to confirm payment");

    const updated = await res.json();

    // Update local state
    setRepairs(prev =>
      prev.map(r => (r._id === repairId ? updated : r))
    );

  } catch (err) {
    console.error(err);
    alert("Failed to confirm payment");
  }
};
const monthlyEarnings = repairs
  .filter(r => {
    if (r.status !== "paid") return false;
    if (!r.paidAt) return false;

    const paidDate = new Date(r.paidAt);
    const now = new Date();

    return (
      paidDate.getMonth() === now.getMonth() &&
      paidDate.getFullYear() === now.getFullYear()
    );
  })
  .reduce((sum, r) => sum + (r.amount || 0), 0);
  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">
          Payment Center
        </h1>

<div className="relative overflow-hidden rounded-3xl p-8 border border-emerald-400/30 
  bg-gradient-to-br from-emerald-500/10 via-black/40 to-emerald-900/20 
  backdrop-blur-3xl shadow-[0_0_60px_rgba(16,185,129,0.6)]">

  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#10b981,_transparent)]" />          
<p className="text-sm tracking-widest uppercase text-emerald-300/80">
  This Month's Earnings
</p><p className="text-4xl font-bold text-emerald-400 mt-2">
  ${monthlyEarnings.toFixed(2)}
</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

        <table className="w-full text-sm">
          <thead className="bg-white/10 text-gray-300">
            <tr>
              <th className="p-4 text-left">Repair ID</th>
              <th className="p-4 text-left">Device</th>
              <th className="p-4 text-left">Issue</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Method</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {repairs.map(repair => (
              <tr
                key={repair._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 font-mono text-purple-300">
                  {repair._id.slice(-6)}
                </td>

                <td className="p-4">{repair.deviceModel}</td>
                <td className="p-4">{repair.issue}</td>
                <td className="p-4 text-gray-400">
                  {repair.customer}
                </td>

                <td className="p-4 capitalize">
                  {repair.paymentMethod || "-"}
                </td>

                <td className="p-4 text-emerald-300 font-semibold">
                  ${repair.amount?.toFixed(2)}
                </td>

                <td className="p-4">
{repair.paymentMethod === "cod" &&
repair.status === "awaiting_payment" ? (
  <button
onClick={() => confirmCash(repair._id)}                      className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold"
                    >
                      Confirm Cash
                    </button>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-4 capitalize">
                  <span
                    className={
                      repair.status === "paid"
                        ? "text-emerald-400"
                        : "text-yellow-400"
                    }
                  >
                    {repair.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {repairs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No payment-related repairs yet.
          </div>
        )}
      </div>
    </div>
  );
}
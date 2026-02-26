import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
type PaymentStatus = "unpaid" | "paid" | "refunded";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  qty: number;
  img?: string;
  model?: string;
  color?: string;
};

type Order = {
  _id: string;
  user?: { name?: string; email?: string; role?: string } | null;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: "cod" | "paypal" | "card";
  paymentStatus?: PaymentStatus;
  createdAt: string;
};

type OrdersResponse = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  orders: Order[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const load = async (opts?: { page?: number; q?: string; status?: string }) => {
    try {
      setErr("");
      setLoading(true);

      const p = opts?.page ?? page;
      const query = (opts?.q ?? q).trim();
      const st = (opts?.status ?? status).trim();

      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(limit));
      if (query) params.set("q", query);
      if (st) params.set("status", st);

      const data = await api<OrdersResponse>(`/admin/orders?${params.toString()}`);

      // ✅ backend shape: { page, limit, totalCount, totalPages, orders }
      if (!data || !Array.isArray(data.orders)) {
        setOrders([]);
        setErr("Invalid response from server");
        return;
      }

      setOrders(data.orders);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (e: any) {
      setErr(e?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // Local filter only for UI typing feel (backend already filters by q)
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((o) => {
      const userText = `${o.user?.name || ""} ${o.user?.email || ""}`.toLowerCase();
      const idText = (o._id || "").toLowerCase();
      const statusText = (o.status || "").toLowerCase();
      return userText.includes(query) || idText.includes(query) || statusText.includes(query);
    });
  }, [orders, q]);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      await api(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      load();
    } catch (e: any) {
      alert(e?.message || "Update failed");
    }
  };

  const refundOrder = async (id: string) => {
    if (!confirm("Refund this order?")) return;
    try {
      await api(`/admin/orders/${id}/refund`, {
        method: "POST",
        body: JSON.stringify({ reason: "Refunded by admin" }),
      });
      load();
    } catch (e: any) {
      alert(e?.message || "Refund failed");
    }
  };

  const downloadInvoice = async (id: string) => {
    try {
      // invoice endpoint returns PDF (not JSON) -> use fetch directly
      const BASE_URL =
        import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
      const sessionRaw = localStorage.getItem("fixonwheels_session");
      const token =
        (sessionRaw ? JSON.parse(sessionRaw)?.token : null) ||
        localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/admin/orders/${id}/invoice`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Invoice failed: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.message || "Invoice download failed");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete (soft delete) this order?")) return;
    try {
      await api(`/admin/orders/${id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    }
  };

  const onSearch = () => {
    setPage(1);
    load({ page: 1, q, status });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Orders</h1>
          <p className="text-white/60 mt-1">
            View orders, update status, refund, invoice, delete
          </p>
          <p className="text-white/50 mt-1 text-sm">Total: {totalCount}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
            className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm outline-none"
          >
            <option value="">All status</option>
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
            <option value="refunded">refunded</option>
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by user / email / id / status..."
            className="w-[320px] max-w-[70vw] rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm outline-none"
          />

          <button
            onClick={onSearch}
            className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold"
          >
            Search
          </button>

          <button
            onClick={() => load()}
            className="rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm font-semibold"
          >
            Refresh
          </button>
        </div>
      </div>

      {err && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          {err} (Backend: GET /api/admin/orders)
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-white/70">Loading orders...</div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="p-3">User</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Pay</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id} className="border-t border-white/10 align-top">
                    <td className="p-3">
                      <div className="font-semibold">{o.user?.name || "Unknown"}</div>
                      <div className="text-white/70">{o.user?.email || "-"}</div>
                      <div className="text-white/40 text-xs mt-1">{o._id}</div>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        {(o.items || []).slice(0, 3).map((it, idx) => (
                          <div key={idx} className="text-white/80">
                            {it.title} × {it.qty}
                            <span className="text-white/50">
                              {" "}
                              (Rs. {it.price})
                            </span>
                          </div>
                        ))}
                        {(o.items || []).length > 3 && (
                          <div className="text-white/50 text-xs">
                            +{(o.items || []).length - 3} more...
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-3 font-bold">
                      Rs. {(o.total ?? 0).toLocaleString()}
                    </td>

                    <td className="p-3">
                      <div className="text-white/80">{o.paymentMethod || "-"}</div>
                      <div className="text-white/50 text-xs">
                        {o.paymentStatus || "unpaid"}
                      </div>
                    </td>

                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateStatus(o._id, e.target.value as OrderStatus)
                        }
                        className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                        <option value="refunded">refunded</option>
                      </select>
                    </td>

                    <td className="p-3 text-white/70">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => downloadInvoice(o._id)}
                          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white hover:bg-white/10"
                        >
                          Invoice
                        </button>

                        <button
                          onClick={() => refundOrder(o._id)}
                          className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-yellow-200 hover:bg-yellow-500/20"
                        >
                          Refund
                        </button>

                        <button
                          onClick={() => deleteOrder(o._id)}
                          className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td className="p-4 text-white/60" colSpan={7}>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-white/60 text-sm">
              Page <b>{page}</b> of <b>{totalPages}</b>
            </div>

            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
                  page <= 1
                    ? "border-white/10 text-white/30 cursor-not-allowed"
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                Prev
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
                  page >= totalPages
                    ? "border-white/10 text-white/30 cursor-not-allowed"
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { api } from "../../services/api";

type TechnicianStatus = "pending" | "approved" | "rejected";

type TechnicianItem = {
  _id: string;
  name: string;
  email: string;
  role: "technician";
  technicianStatus?: TechnicianStatus; // ✅ NEW
};

export default function AdminTechnicians() {
  const [techs, setTechs] = useState<TechnicianItem[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // track action loading per technician
  const [actingId, setActingId] = useState<string>("");

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      // ✅ Backend returns technicians with technicianStatus
      const data = await api<TechnicianItem[]>("/admin/technicians");
      setTechs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e.message || "Failed to load technicians");
      setTechs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = techs.filter((t) => {
    const text = `${t.name} ${t.email} ${t.role} ${t.technicianStatus || ""}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  const approveTechnician = async (id: string) => {
    if (!confirm("Approve this technician?")) return;
    try {
      setErr("");
      setActingId(id);
      await api(`/admin/technicians/${id}/approve`, { method: "PATCH" });
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to approve technician");
    } finally {
      setActingId("");
    }
  };

  const rejectTechnician = async (id: string) => {
    if (!confirm("Reject this technician?")) return;
    try {
      setErr("");
      setActingId(id);
      await api(`/admin/technicians/${id}/reject`, { method: "PATCH" });
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to reject technician");
    } finally {
      setActingId("");
    }
  };

  const deleteTechnician = async (id: string) => {
    if (!confirm("Delete this technician?")) return;
    try {
      setErr("");
      setActingId(id);
      await api(`/admin/technicians/${id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to delete technician");
    } finally {
      setActingId("");
    }
  };

  const StatusBadge = ({ status }: { status?: TechnicianStatus }) => {
    const s: TechnicianStatus = status || "pending";

    if (s === "approved") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-500/15 border border-green-500/30 px-3 py-1 text-xs text-green-200">
          Approved ✅
        </span>
      );
    }

    if (s === "rejected") {
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs text-red-200">
          Rejected ❌
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-yellow-400/15 border border-yellow-400/30 px-3 py-1 text-xs text-yellow-200">
        Pending ⏳
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Technicians</h1>
          <p className="text-white/60 mt-1">View and manage technicians</p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search technicians..."
          className="w-full sm:w-[280px] rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm outline-none"
        />
      </div>

      {err && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          {err}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              {/* ✅ replaced Role column */}
              <th className="p-3">Status / Approve</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="p-4 text-white/60" colSpan={4}>
                  Loading technicians...
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((t) => {
                const status: TechnicianStatus = (t.technicianStatus || "pending") as TechnicianStatus;
                const busy = actingId === t._id;

                return (
                  <tr key={t._id} className="border-t border-white/10">
                    <td className="p-3 font-semibold">{t.name}</td>
                    <td className="p-3 text-white/80">{t.email}</td>

                    {/* ✅ Status / Accept / Decline */}
                    <td className="p-3">
                      {status === "pending" ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={status} />

                          <button
                            disabled={busy}
                            onClick={() => approveTechnician(t._id)}
                            className={`rounded-xl border border-green-500/40 bg-green-500/10 px-3 py-2 text-green-200 hover:bg-green-500/20 ${
                              busy ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                          >
                            Accept
                          </button>

                          <button
                            disabled={busy}
                            onClick={() => rejectTechnician(t._id)}
                            className={`rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-yellow-100 hover:bg-yellow-400/20 ${
                              busy ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <StatusBadge status={status} />
                      )}
                    </td>

                    <td className="p-3">
                      <button
                        disabled={busy}
                        onClick={() => deleteTechnician(t._id)}
                        className={`rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/20 ${
                          busy ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

            {!loading && !filtered.length && (
              <tr>
                <td className="p-4 text-white/60" colSpan={4}>
                  No technicians found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
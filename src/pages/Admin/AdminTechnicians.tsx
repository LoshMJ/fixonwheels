import { useEffect, useState } from "react";
import { api } from "../../services/api";

type TechnicianItem = {
  _id: string;
  name: string;
  email: string;
  role: "technician";
};

export default function AdminTechnicians() {
  const [techs, setTechs] = useState<TechnicianItem[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      // ✅ Backend should return ONLY technicians
      const data = await api<TechnicianItem[]>("/admin/technicians");
      setTechs(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = techs.filter((t) => {
    const text = `${t.name} ${t.email} ${t.role}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  const deleteTechnician = async (id: string) => {
    if (!confirm("Delete this technician?")) return;
    try {
      setErr("");
      await api(`/admin/technicians/${id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      setErr(e.message || "Failed to delete technician");
    }
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
          {err} (Backend needed: GET /api/admin/technicians)
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
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
              filtered.map((t) => (
                <tr key={t._id} className="border-t border-white/10">
                  <td className="p-3 font-semibold">{t.name}</td>
                  <td className="p-3 text-white/80">{t.email}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs">
                      {t.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteTechnician(t._id)}
                      className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

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
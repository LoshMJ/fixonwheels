import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

type UserRole = "customer" | "technician" | "admin";

type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const data = await api<UserItem[]>("/admin/users");
      setUsers(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;

    return users.filter((u) => {
      const t = `${u.name} ${u.email} ${u.role}`.toLowerCase();
      return t.includes(query);
    });
  }, [users, q]);

  const updateRole = async (id: string, role: UserRole) => {
    try {
      setErr("");
      setSavingId(id);

      await api(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });

      // Optimistic UI update (faster than reloading)
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (e: any) {
      setErr(e?.message || "Failed to update role");
      // if failed, reload to be safe
      load();
    } finally {
      setSavingId(null);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setErr("");
      setDeletingId(id);

      await api(`/admin/users/${id}`, { method: "DELETE" });

      // remove from UI
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e: any) {
      setErr(e?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Users</h1>
          <p className="text-white/60 mt-1">
            View users, change roles, delete users
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users..."
            className="w-full sm:w-[280px] rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm outline-none"
          />
          <button
            type="button"
            onClick={load}
            className="rounded-xl bg-white text-black font-bold px-4 py-2 hover:opacity-90"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          {err}
          <div className="text-red-200/70 text-xs mt-1">
            (Backend required: GET /api/admin/users, PATCH/DELETE /api/admin/users/:id)
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="mt-6 text-white/70">Loading users...</div>
      ) : (
        <>
          <div className="mt-4 text-white/60 text-sm">
            Total: <span className="text-white font-bold">{filtered.length}</span>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left text-white/80">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u) => {
                  const isSaving = savingId === u._id;
                  const isDeleting = deletingId === u._id;

                  return (
                    <tr key={u._id} className="border-t border-white/10">
                      <td className="p-3 font-semibold">{u.name}</td>
                      <td className="p-3 text-white/80">{u.email}</td>

                      <td className="p-3">
                        <select
                          value={u.role}
                          disabled={isSaving || isDeleting}
                          onChange={(e) => updateRole(u._id, e.target.value as UserRole)}
                          className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none disabled:opacity-50"
                        >
                          <option value="customer">customer</option>
                          <option value="technician">technician</option>
                          <option value="admin">admin</option>
                        </select>

                        {isSaving && (
                          <span className="ml-2 text-xs text-white/60">saving...</span>
                        )}
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => deleteUser(u._id)}
                          disabled={isSaving || isDeleting}
                          className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!filtered.length && (
                  <tr>
                    <td className="p-4 text-white/60" colSpan={4}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
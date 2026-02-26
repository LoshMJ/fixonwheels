// frontend/src/pages/admin/AdminSettings.tsx
import { useState } from "react";
import { api } from "../../services/api";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const onSave = async () => {
    setMsg("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMsg("⚠️ Please fill all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMsg("⚠️ New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setMsg("⚠️ Password must be at least 6 characters.");
      return;
    }

    try {
      setSaving(true);

      await api("/admin/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setMsg("✅ Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e: any) {
      setMsg(e?.message || "❌ Password update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Settings</h1>
        <p className="text-white/60 mt-1">Admin has full access to the system</p>
      </div>

      {msg && (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">
          {msg}
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-bold">Change Password</h2>
        <p className="text-white/60 text-sm mt-1">Update your admin password</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm text-white/70">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
              placeholder="Current password"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
              placeholder="New password"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Confirm new password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className={`mt-5 w-full rounded-xl py-3 font-bold ${
            saving ? "bg-white/20 text-white/60" : "bg-white text-black hover:opacity-90"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
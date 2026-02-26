import { useEffect, useState } from "react";
import { getSession, clearSession } from "../../utils/auth";

interface Repair {
  _id: string;
  deviceModel: string;
  issue: string;
  status: string;
  paymentMethod?: string;
}

interface Purchase {
  _id: string;
  totalAmount: number;
  createdAt: string;
}

export default function CustomerProfile() {
  const session = getSession();
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/repairs/customer/profile", {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          password: "",
        });
      });
  }, []);

  if (!profile) return <div className="p-10 text-white">Loading...</div>;

  const handleSave = async () => {
    await fetch("http://localhost:5000/api/repairs/customer/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(formData),
    });

    alert("Profile updated");
    window.location.reload();
  };

  const logout = () => {
    clearSession();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">

      {/* PROFILE CARD */}
      <div className="bg-black/60 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">

        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        {editMode ? (
          <>
            <input
              className="bg-gray-800 p-2 rounded w-full mb-3"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              className="bg-gray-800 p-2 rounded w-full mb-3"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password"
              className="bg-gray-800 p-2 rounded w-full mb-3"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <button
              onClick={handleSave}
              className="bg-emerald-600 px-4 py-2 rounded mr-3"
            >
              Save
            </button>

            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-600 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">{profile.user.name}</h2>
            <p className="text-gray-400 mb-4">{profile.user.email}</p>

            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </>
        )}

        {/* REPAIRS */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">My Repairs</h2>
          {profile.repairs.length === 0 ? (
            <p className="text-gray-500">No repairs yet</p>
          ) : (
            profile.repairs.map((r: Repair) => (
              <div key={r._id} className="bg-gray-800 p-4 rounded mb-2">
                {r.deviceModel} - {r.issue} ({r.status})
              </div>
            ))
          )}
        </div>

        {/* PURCHASES */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
          {profile.purchases.length === 0 ? (
            <p className="text-gray-500">No purchases yet</p>
          ) : (
            profile.purchases.map((p: Purchase) => (
              <div key={p._id} className="bg-gray-800 p-4 rounded mb-2">
                Order Total: ${p.totalAmount} <br />
                Date: {new Date(p.createdAt).toLocaleDateString()}
              </div>
            ))
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="bg-red-600 w-full mt-10 py-3 rounded"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
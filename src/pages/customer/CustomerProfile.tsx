import { useEffect, useState } from "react";
import { getSession, clearSession } from "../../utils/auth";
import galaxyBg from "../../assets/galaxy-bg.jpg";
<section
  className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-white bg-cover bg-center"
  style={{ backgroundImage: `url(${galaxyBg})` }}
></section>
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

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/repairs/customer/profile",
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();

        setProfile(data);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          password: "",
        });
      } catch (err) {
        console.error(err);
        alert("Session expired. Please login again.");
        clearSession();
        window.location.href = "/login";
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  // ✅ AVATAR LOGIC
  const user = profile.user;

  const avatarUrl =
    user.profileImage && user.profileImage !== ""
      ? `http://localhost:5000/uploads/${user.profileImage}`
      : null;

  const userInitial = user.name?.charAt(0)?.toUpperCase() || "U";

  const handleSave = async () => {
    try {
      const updated = await fetch(
        "http://localhost:5000/api/repairs/customer/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!updated.ok) throw new Error("Update failed");

      const newData = await updated.json();

      setProfile(newData);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const logout = () => {
    clearSession();
    window.location.href = "/login";
  };
  const handleUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const file = e.target.files[0];

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(
      "http://localhost:5000/api/repairs/profile/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");

    // Re-fetch updated profile after upload
    const profileRes = await fetch(
      "http://localhost:5000/api/repairs/customer/profile",
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );

    const updatedProfile = await profileRes.json();
    setProfile(updatedProfile);

  } catch (err) {
    console.error(err);
    alert("Image upload failed");
  }
};
return (
<section
  className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-white bg-cover bg-center"
  style={{ backgroundImage: `url(${galaxyBg})` }}
>
  {/* Space Background */}
  <div className="absolute inset-0 bg-[url('/src/assets/space-bg.png')] bg-cover bg-center bg-no-repeat" />
  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(139,92,246,0.15),transparent_40%)] animate-pulse opacity-40 pointer-events-none" />

  <img
    src="/src/assets/astronaut.png"
    className="absolute right-[6%] top-[25%] w-[230px] opacity-90 animate-float-rotate drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] z-[2] pointer-events-none"
  />

  {/* Glass Card */}
  <div className="relative z-[5] w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-10 shadow-[0_0_80px_rgba(255,183,197,0.35)] hover:shadow-[0_0_100px_rgba(255,140,105,0.45)] transition-all duration-500">

    {/* Header */}
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-4xl font-bold">
        My <span className="text-purple-400">Profile</span>
      </h1>
      <button
        onClick={logout}
        className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* ================= LEFT PANEL ================= */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">

        {/* 🔥 AVATAR — ALWAYS VISIBLE */}
        <div className="flex flex-col items-center mb-8 relative group">
          <label
            className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border border-rose-200/30 shadow-[0_0_50px_rgba(255,183,197,0.35)] transition-all duration-500 group-hover:shadow-[0_0_70px_rgba(255,140,105,0.55)]"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-400 to-orange-300 text-white text-4xl font-semibold">
                {userInitial}
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm text-white font-medium transition duration-300">
              Change Photo
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        {/* 🔥 CONDITIONAL CONTENT (ONLY FORM SWITCHES) */}
        {editMode ? (
          <>
            <input
              className="bg-black/40 border border-white/20 p-3 rounded w-full mb-3"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              className="bg-black/40 border border-white/20 p-3 rounded w-full mb-3"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              className="bg-black/40 border border-white/20 p-3 rounded w-full mb-4"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-purple-600 rounded-xl"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-5 py-2 bg-gray-700 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-2">
              {profile.user.name}
            </h2>
            <p className="text-gray-400 mb-1">{profile.user.email}</p>
            <p className="text-sm text-purple-300 mb-6">
              {profile.user.role}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-purple-600 rounded-xl hover:bg-purple-700 transition"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="md:col-span-2 space-y-8">

        {/* Repairs */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">
            My <span className="text-purple-400">Repairs</span>
          </h2>
          {profile.repairs.length === 0 ? (
            <p className="text-gray-500">No repairs yet</p>
          ) : (
            profile.repairs.map((r: any) => (
              <div
                key={r._id}
                className="bg-black/40 p-4 rounded-xl mb-3 transition hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,140,105,0.25)]"
              >
                <div className="flex justify-between items-center">
                  <span>{r.deviceModel} – {r.issue}</span>
                  <span
                    className={`px-4 py-1 rounded-full text-sm ${
                      r.status === "completed"
                        ? "bg-green-600"
                        : r.status === "in_progress"
                        ? "bg-yellow-500"
                        : "bg-gray-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Purchases */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">
            My <span className="text-purple-400">Purchases</span>
          </h2>
          {profile.purchases.length === 0 ? (
            <p className="text-gray-500">No purchases yet</p>
          ) : (
            profile.purchases.map((p: any) => (
              <div
                key={p._id}
                className="bg-black/40 p-4 rounded-xl mb-3 transition hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,210,180,0.2)]"
              >
                <p>Total: ${p.totalAmount}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  </div>
</section>
)}
import { useEffect, useState } from "react";
import { getSession, logout } from "../../utils/auth";

interface ProfileData {
  technician: {
    name: string;
    email: string;
    profileImage?: string;
  };
  totalRepairs: number;
  avgRating: number;
  level: string;
}

export default function TechnicianProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const session = getSession();

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!session?.token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/repairs/profile",
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setProfile(data);

        setFormData({
          name: data.technician.name,
          email: data.technician.email,
          password: "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    if (!session?.token || !profile) return;

    try {
      await fetch("http://localhost:5000/api/repairs/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);

        await fetch(
          "http://localhost:5000/api/repairs/profile/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
            body: form,
          }
        );
      }

      setEditMode(false);
      window.location.reload();
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading)
    return <div className="p-10 text-white">Loading profile...</div>;

  if (!profile)
    return <div className="p-10 text-white">Failed to load profile.</div>;

  return (
    <div className="space-y-10">

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-black/60 backdrop-blur-2xl border border-emerald-400/30 
        rounded-3xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)] text-center">

        {/* PROFILE IMAGE */}
        <div className="mb-6">
          <label className="cursor-pointer inline-block relative">
            <div className="w-28 h-28 rounded-full border-2 border-emerald-400 
              flex items-center justify-center text-4xl bg-gray-900 
              overflow-hidden mx-auto">

              {profile.technician.profileImage ? (
                <img
                  src={`http://localhost:5000/uploads/${profile.technician.profileImage}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                profile.technician.name[0]
              )}
            </div>

            {editMode && (
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
              />
            )}
          </label>
        </div>

        {/* NAME */}
        {editMode ? (
          <input
            className="bg-white/10 border border-white/20 text-white 
              p-3 rounded-xl mb-3 w-full max-w-sm text-center"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        ) : (
          <h2 className="text-2xl font-bold">
            {profile.technician.name}
          </h2>
        )}

        {/* EMAIL */}
        {editMode ? (
          <input
            className="bg-white/10 border border-white/20 text-white 
              p-3 rounded-xl mb-3 w-full max-w-sm text-center"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        ) : (
          <p className="text-gray-400 mt-1">
            {profile.technician.email}
          </p>
        )}

        {/* PASSWORD */}
        {editMode && (
          <input
            type="password"
            placeholder="New Password (optional)"
            className="bg-white/10 border border-white/20 text-white 
              p-3 rounded-xl mb-4 w-full max-w-sm text-center"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        )}

        <p className="text-emerald-400 mt-3 font-semibold">
          {profile.level} Level
        </p>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-4 justify-center">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-full bg-emerald-600 
                  hover:bg-emerald-500 transition"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="px-6 py-2 rounded-full bg-gray-600 
                  hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 rounded-full bg-blue-600 
                hover:bg-blue-500 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white/5 border border-white/10 rounded-2xl 
          p-6 text-center backdrop-blur-xl">

          <p className="text-gray-400 text-sm">
            Completed Repairs
          </p>

          <p className="text-3xl font-bold text-emerald-400 mt-2">
            {profile.totalRepairs}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl 
          p-6 text-center backdrop-blur-xl">

          <p className="text-gray-400 text-sm">
            Average Rating
          </p>

          <p className="text-3xl font-bold text-yellow-400 mt-2">
            {profile.avgRating.toFixed(1)} ★
          </p>
        </div>
      </div>

      {/* ================= LOGOUT ================= */}
      <button
        onClick={() => {
          logout();
          window.location.href = "/";
        }}
        className="w-full py-3 bg-red-600 hover:bg-red-500 
          rounded-xl font-semibold transition"
      >
        Logout
      </button>
    </div>
  );
}
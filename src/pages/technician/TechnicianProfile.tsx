// src/pages/technician/TechnicianProfile.tsx
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
  const session = getSession();

  // STEP 1 — Edit mode + form state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!session?.token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/repairs/profile", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);

        // STEP 2 — Fill form with current profile data
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

  // STEP 4 — Save profile changes (text + image)
  const handleSave = async () => {
    if (!session?.token) return;

    try {
      // 1. Update text fields
      const textRes = await fetch("http://localhost:5000/api/repairs/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!textRes.ok) throw new Error("Failed to update profile");

      // 2. Upload image if selected
      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);

        const imageRes = await fetch(
          "http://localhost:5000/api/repairs/profile/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
            body: form,
          }
        );

        if (!imageRes.ok) throw new Error("Failed to upload image");
      }

      alert("Profile updated successfully!");
      setEditMode(false);

      // Reload profile to show updated data
      window.location.reload();
    } catch (err: any) {
      console.error("Profile save error:", err);
      alert("Failed to update profile: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-10 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
        Failed to load profile. Please try again.
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* STEP 3 — Editable Profile Card */}
        <div className="bg-black/60 backdrop-blur-2xl border border-emerald-400/30 rounded-3xl p-8 shadow-xl text-center">
          {/* PROFILE IMAGE */}
          <div className="mb-4">
            <label className="cursor-pointer">
              <div className="w-24 h-24 mx-auto rounded-full border-2 border-emerald-400 flex items-center justify-center text-3xl bg-gray-900 overflow-hidden">
                {profile.technician.profileImage ? (
                  <img
                    src={`http://localhost:5000/uploads/${profile.technician.profileImage}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.technician.name[0]
                )}
              </div>

              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setImageFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              )}
            </label>
          </div>

          {/* NAME */}
          {editMode ? (
            <input
              className="bg-gray-800 text-white p-2 rounded mb-2 w-full text-center"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          ) : (
            <h2 className="text-2xl font-bold">{profile.technician.name}</h2>
          )}

          {/* EMAIL */}
          {editMode ? (
            <input
              className="bg-gray-800 text-white p-2 rounded mb-2 w-full text-center"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-400">{profile.technician.email}</p>
          )}

          {/* PASSWORD (only in edit mode) */}
          {editMode && (
            <input
              type="password"
              placeholder="New Password (leave blank to keep current)"
              className="bg-gray-800 text-white p-2 rounded mb-4 w-full text-center"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          )}

          <p className="text-emerald-400 mt-2">{profile.level} Level</p>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-4 justify-center">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-full transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    // Reset form to original data
                    setFormData({
                      name: profile.technician.name,
                      email: profile.technician.email,
                      password: "",
                    });
                    setImageFile(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-full transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm">Completed Repairs</p>
            <p className="text-2xl font-bold text-emerald-400">
              {profile.totalRepairs}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm">Average Rating</p>
            <p className="text-2xl font-bold text-yellow-400">
              {profile.avgRating.toFixed(1)} ★
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
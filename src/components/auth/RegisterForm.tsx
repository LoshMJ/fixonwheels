import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlowButton from "../ui/GlowButton";
import { setSession } from "../../utils/auth";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // ✅ Save session after register (auto login)
setSession({
  token: data.token,
  role: data.user.role,   // or data.role if your API sends role directly
  user: data.user,        // ✅ store the user
});

      // ✅ Redirect by role
      if (data.user.role === "technician") {
        navigate("/technician");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-2">Create Account</h2>
      <p className="text-gray-400 mb-8">
        Join FixOnWheels today
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none transition"
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none transition"
        />

        {/* Role Selection */}
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="customer"
              checked={role === "customer"}
              onChange={() => setRole("customer")}
            />
            Customer
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="technician"
              checked={role === "technician"}
              onChange={() => setRole("technician")}
            />
            Technician
          </label>
        </div>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <GlowButton className="w-full h-12">
          {loading ? "Creating Account..." : "Create Account"}
        </GlowButton>
      </form>

      <p className="text-center text-gray-400 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-purple-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
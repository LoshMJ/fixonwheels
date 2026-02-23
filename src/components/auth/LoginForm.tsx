// src/components/auth/LoginForm.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GlowButton from "../ui/GlowButton";
import { setSession, getSession } from "../../utils/auth";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "customer" | "technician" | "admin";
  };
};

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // ✅ STOP page refresh
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as Partial<LoginResponse> & { message?: string };

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      if (!data.token || !data.user?.role) {
        setError("Invalid server response (missing token/role).");
        setLoading(false);
        return;
      }

      // ✅ Save token + role
      setSession({
        token: data.token,
        role: data.user.role,
        user: data.user,
      });

      // ✅ Redirect: if user tried to access a protected page before login
      const from = (location.state as any)?.from?.pathname as string | undefined;

      // ✅ Role-based home fallback
      const roleHome =
        data.user.role === "technician"
          ? "/technician"
          : data.user.role === "admin"
          ? "/admin"
          : "/";

      navigate(from || roleHome, { replace: true });
    } catch (err) {
      setError("Network error. Is the backend running on :5000?");
    } finally {
      setLoading(false);
    }
  }

  // Optional: if already logged in, bounce out of login page
  const session = getSession();
  // if (session?.token) navigate("/"); // (enable later if you want)

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
      <p className="text-gray-400 mb-8">Login to continue to FixOnWheels</p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none transition"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none transition"
          required
        />

        {/* If GlowButton doesn't support type="submit", keep it like this inside <form> */}
 <button
    type="submit"
    className="w-full h-12 bg-black text-white rounded-lg"
  > Login </button>
      </form>

      <p className="text-center text-gray-400 mt-6">
        Don’t have an account?{" "}
        <Link to="/register" className="text-purple-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
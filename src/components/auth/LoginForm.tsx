// src/components/auth/LoginForm.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setSession } from "../../utils/auth";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as LoginResponse & { message?: string };

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save session properly
      setSession({
        token: data.token,
        role: data.user.role,
        user: data.user,
      });

      // ✅ Redirect logic
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

      const roleHome =
        data.user.role === "technician"
          ? "/technician"
          : data.user.role === "admin"
          ? "/admin"
          : "/";

      navigate(from || roleHome, { replace: true });

    } catch (err: any) {
      setError(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">
        Welcome Back
      </h2>

      {error && (
        <p className="text-red-400 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
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
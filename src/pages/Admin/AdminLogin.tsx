import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔐 Hardcoded admin credentials (temporary)
  const ADMIN_EMAIL = "admin@fixonwheels.com";
  const ADMIN_PASSWORD = "12345";

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      // Save admin flag
      localStorage.setItem("isAdmin", "true");

      // Redirect to dashboard
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    setError("Invalid admin email or password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b16] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold text-white">
          Welcome Back
        </h2>
        <p className="mt-2 text-white/60">
          Login to continue to FixOnWheels
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="admin@fixonwheels.com"
          className="mt-6 w-full rounded-xl border border-white/10 bg-black/30 p-4 text-white outline-none focus:border-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 p-4 text-white outline-none focus:border-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-black py-4 text-white font-semibold hover:opacity-90 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
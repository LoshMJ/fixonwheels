import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@fixonwheels.com");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data?.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 FORCE go to admin dashboard
navigate("/admin", { replace: true });

      // ✅ go back to where user came from OR go to home
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });

      // ✅ (optional) if you want admin to go dashboard only once, use:
      // navigate("/admin", { replace: true });

    } catch {
      setErr("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white/5 p-6 rounded-2xl">
        <h1 className="text-3xl font-bold">Admin Login</h1>

        {err && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
            {err}
          </div>
        )}

        <input
          className="mt-4 w-full p-3 rounded-xl bg-white/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="mt-3 w-full p-3 rounded-xl bg-white/10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        <button className="mt-4 w-full bg-white text-black font-bold p-3 rounded-xl">
          Login
        </button>
      </form>
    </div>
  );
}
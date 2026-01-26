import { Link } from "react-router-dom";
import GlowButton from "../ui/GlowButton";

export default function RegisterForm() {
  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-2">Create Account</h2>
      <p className="text-gray-400 mb-8">
        Join FixOnWheels today
      </p>

      <form className="space-y-5">
        <input
          type="text"
          placeholder="Full name"
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none transition"
        />

        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none transition"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-400 outline-none transition"
        />

        <GlowButton className="w-full h-12">
          Create Account
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

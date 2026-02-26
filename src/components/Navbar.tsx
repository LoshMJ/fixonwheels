import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import GlowButton from "../components/ui/GlowButton";

function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();

  const user = getUser();

  // Check if current page is Cart
  const isCartPage = location.pathname === "/cart";

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b border-white/10
      ${isCartPage ? "bg-black" : ""}
      `}
    >
      <nav className="max-w-[1500px] mx-auto grid grid-cols-3 items-center px-12 py-5">
        {/* LEFT — Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/src/assets/logo.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-wide">
              FixOnWheels
            </span>
          </Link>
        </div>

        {/* CENTER — Nav links */}
        <div className="hidden md:flex justify-center items-center gap-14 text-white text-lg font-medium">
          <Link to="/" className="hover:text-purple-400 transition">
            Home
          </Link>
          <Link to="/repair" className="hover:text-purple-400 transition">
            Repair
          </Link>
          <Link to="/shop" className="hover:text-purple-400 transition">
            Shop
          </Link>
          <Link to="/chats" className="hover:text-purple-400 transition">
            Chats
          </Link>

          <Link
            to="/cart"
            className="hover:text-purple-400 transition relative"
          >
            <ShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1.5">
                {items.length}
              </span>
            )}
          </Link>

          {/* ✅ Admin Panel link only if admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* RIGHT — Login / Logout */}
        <div className="flex justify-end">
          {!user ? (
            <GlowButton className="w-23 h-12 mt-1">
              <Link to="/login" className="w-10 h-15 flex justify-center">
                LOGIN
              </Link>
            </GlowButton>
          ) : (
            <div className="flex items-center gap-3">
              {/* small role badge */}
              <span className="hidden md:inline text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
                {user.email}
              </span>

              <GlowButton className="w-23 h-12 mt-1">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-10 h-15 flex justify-center"
                >
                  LOGOUT
                </button>
              </GlowButton>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
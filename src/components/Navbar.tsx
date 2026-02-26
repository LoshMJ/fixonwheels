import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import GlowButton from "../components/ui/GlowButton";
import { getSession, clearSession } from "../utils/auth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();

  const [session, setSession] = useState(getSession());

  // Update session when component loads
  useEffect(() => {
    setSession(getSession());
  }, []);

  const isCartPage = location.pathname === "/cart";

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b border-white/10
      ${isCartPage ? "bg-black" : ""}`}
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
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          <Link to="/repair" className="hover:text-purple-400 transition">Repair</Link>
          <Link to="/shop" className="hover:text-purple-400 transition">Shop</Link>
          <Link to="/chats" className="hover:text-purple-400 transition">Chats</Link>

          <Link to="/cart" className="hover:text-purple-400 transition relative">
            <ShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1.5">
                {items.length}
              </span>
            )}
          </Link>
        </div>

        {/* RIGHT — Dynamic Login/Profile */}
        <div className="flex justify-end gap-3">
          {session ? (
            <>
              <GlowButton className="w-28 h-12 mt-1">
                <Link to="/profile" className="flex justify-center items-center w-full h-full">
                  PROFILE
                </Link>
              </GlowButton>

              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <GlowButton className="w-23 h-12 mt-1">
              <Link to="/login" className="flex justify-center items-center w-full h-full">
                LOGIN
              </Link>
            </GlowButton>
          )}
        </div>

      </nav>
    </header>
  );
}
import van from "../assets/van.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative w-full bg-transparent">

      {/* VAN + GLOW (FLOATING ABOVE FOOTER) */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="relative flex items-center justify-center">
         
          {/* Circle base */}
          <div className="w-[140px] h-[140px] rounded-full bg-[#0b0b14] flex items-center justify-center shadow-[0_0_80px_rgba(124,58,237,0.5)]">
            {/* Van image */}
            <img
              src={van}
              alt="FixOnWheels Van"
              className="w-[120px] object-contain -translate-y-2"
            />
          </div>
        </div>
      </div>

      {/* FOOTER BODY */}
      <div className="relative bg-[#0b0b14]  px-10 pt-40 pb-16 text-white">

        {/* CONTENT GRID */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* LEFT — CONTACT */}
          <div className="space-y-4 text-sm text-gray-300">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <p>FixOnWheels (Pvt) Ltd</p>
            <p>Doorstep Device Repairs</p>
            <p>Sri Lanka</p>
            <p className="mt-4">📞 +94 762 604 713</p>
            <p>✉️ support@fixonwheels.lk</p>

            <div className="flex gap-4 mt-4">
              <a className="hover:text-purple-400 cursor-pointer">Instagram</a>
              <a className="hover:text-purple-400 cursor-pointer">Facebook</a>
              <a className="hover:text-purple-400 cursor-pointer">LinkedIn</a>
            </div>
          </div>

          {/* CENTER — BRAND */}
          <div className="text-center flex flex-col items-center justify-center gap-6">
            <h3 className="text-3xl font-bold">
              Fix<span className="text-purple-400">On</span>Wheels
            </h3>

            <p className="text-gray-400 max-w-sm">
              Trusted doorstep repairs with verified technicians, honest pricing,
              and real-time updates all at your convenience.
            </p>

            <div className="flex gap-4 mt-4">
              <Link
                to="/repair"
                className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 transition shadow-lg"
              >
                Book Repair
              </Link>

              <Link
                to="/technicians"
                className="px-6 py-2 rounded-full border border-white/20 hover:border-purple-400 transition"
              >
                Our Technicians
              </Link>
            </div>
          </div>

          {/* RIGHT — QUICK LINKS */}
          <div className="space-y-4 text-sm text-gray-300 md:text-right">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>

            <div className="flex flex-col gap-2">
              <Link to="/repair" className="hover:text-purple-400">
                Book a Repair
              </Link>
              <Link to="/shop" className="hover:text-purple-400">
                Shop
              </Link>
              <Link to="/chat" className="hover:text-purple-400">
                Chat
              </Link>
              <Link to="/login" className="hover:text-purple-400">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} FixOnWheels. All rights reserved.</p>

          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-purple-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-purple-400">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

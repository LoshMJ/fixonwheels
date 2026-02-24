import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Repair from "./pages/Repair";
import Shop from "./pages/Shop";
import Chats from "./pages/Chats";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import TechnicianLayout from "./layouts/TechnicianLayout";
import IncomingRepairs from "./pages/technician/IncomingRepairs";
import ActiveRepair from "./pages/technician/ActiveRepair";
import Cart from "./pages/Cart";
import AllProducts from "./components/AllProducts/AllProducts";
import MobilesPage from "./pages/categories/mobiles";
import ChargersPage from "./pages/categories/chargers";
import HeadsetsPage from "./pages/categories/Headsets";
import DisplaysPage from "./pages/categories/displays";
import CasesPage from "./pages/categories/cases";


// ✅ Admin imports (already in your code)
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/all-products" element={<AllProducts />} />

          <Route path="/shop/mobiles" element={<MobilesPage />} />
          <Route path="/shop/chargers" element={<ChargersPage />} />
          <Route path="/shop/headsets" element={<HeadsetsPage />} />
          <Route path="/shop/displays" element={<DisplaysPage />} />
          <Route path="/shop/cases" element={<CasesPage />} />
        </Route>

        {/*  Admin routes (NEW) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Optional: if user goes to /admin → send to dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Technician Portal */}
        <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
          <Route path="/technician" element={<TechnicianDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
          <Route element={<TechnicianLayout />}>
            <Route path="/technician" element={<div>Tech Home</div>} />
            <Route path="/technician/incoming" element={<IncomingRepairs />} />
            <Route path="/technician/active" element={<ActiveRepair />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import MainLayout from "./layouts/MainLayout";
import TechnicianLayout from "./layouts/TechnicianLayout";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Repair from "./pages/Repair";
import Shop from "./pages/Shop";
import Chats from "./pages/Chats";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";

import AllProducts from "./components/AllProducts/AllProducts";
import MobilesPage from "./pages/categories/mobiles";
import ChargersPage from "./pages/categories/chargers";
import HeadsetsPage from "./pages/categories/Headsets";
import DisplaysPage from "./pages/categories/displays";
import CasesPage from "./pages/categories/cases";

import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import IncomingRepairs from "./pages/technician/IncomingRepairs";
import ActiveRepair from "./pages/technician/ActiveRepair";

// ✅ Admin
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminRoutes from "./routes/AdminRoutes";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminRepairs from "./pages/Admin/AdminRepairs";
import AdminSettings from "./pages/Admin/AdminSettings.tsx";
import AdminSummary from "./pages/Admin/AdminSummary";
import AdminTechnicians from "./pages/Admin/AdminTechnicians";
import AdminShopCategories from "./pages/Admin/AdminShopCategories.tsx";

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

          <Route path="/admin/shop-categories" element={<AdminShopCategories />} />
        </Route>

        {/* ✅ Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ✅ Protected Admin Area */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route index element={<AdminSummary />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="technicians" element={<AdminTechnicians />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="repairs" element={<AdminRepairs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Technician Portal */}
        <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
          <Route path="/technician" element={<TechnicianDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
          <Route element={<TechnicianLayout />}>
            <Route path="/technician/incoming" element={<IncomingRepairs />} />
            <Route path="/technician/active" element={<ActiveRepair />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
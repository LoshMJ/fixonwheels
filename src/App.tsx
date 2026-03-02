import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import MainLayout from "./layouts/MainLayout";
import TechnicianLayout from "./layouts/TechnicianLayout";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

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
import RepairWorkspace from "./pages/technician/RepairWorkspace";
import TechnicianPayments from "./pages/technician/TechnicianPayments";
import TechnicianHistory from "./pages/technician/TechnicianHistory";
import TechnicianProfile from "./pages/technician/TechnicianProfile";

import AdminRoutes from "./routes/AdminRoutes";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminSummary from "./pages/Admin/AdminSummary";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminTechnicians from "./pages/Admin/AdminTechnicians";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminRepairs from "./pages/Admin/AdminRepairs";
import AdminSettings from "./pages/Admin/AdminSettings.tsx";
import AdminShopCategories from "./pages/Admin/AdminShopCategories.tsx";

import Mobiles from "./pages/categories/mobiles";
import Laptops from "./pages/categories/cases";
import Chargers from "./pages/categories/chargers";
import Displays from "./pages/categories/displays";
import Headsets from "./pages/categories/Headsets";

import CustomerProfile from "./pages/customer/CustomerProfile";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ---------------- PUBLIC ---------------- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/chats" element={<Chats />} />

          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<CustomerProfile />} />
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


        {/* Protected Admin Area */}
<Route path="/admin" element={<AdminRoutes />}>
  <Route element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="technicians" element={<AdminTechnicians />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="repairs" element={<AdminRepairs />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="shop-categories" element={<AdminShopCategories />} />
  </Route>
</Route>

        {/* Protected Technician Area - consolidated all technician routes here */}
        <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
          <Route element={<TechnicianLayout />}>
            <Route path="/technician" element={<TechnicianDashboard />} />
            <Route path="/technician/incoming" element={<IncomingRepairs />} />
            <Route path="/technician/active" element={<ActiveRepair />} />
            <Route path="/technician/workspace/:id" element={<RepairWorkspace />} />
            <Route path="/technician/profile" element={<TechnicianProfile />} />
            <Route path="/technician/payments" element={<TechnicianPayments />} />
            <Route path="/technician/history" element={<TechnicianHistory />} />
          </Route>
        </Route>


        {/* ✅ Category Routes */}
        <Route path="/categories/mobiles" element={<Mobiles />} />
        <Route path="/categories/cases" element={<Laptops />} />
        <Route path="/categories/chargers" element={<Chargers />} />
        <Route path="/categories/displays" element={<Displays />} />
        <Route path="/categories/headsets" element={<Headsets />} />
      

        {/* Protected Customer Area */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer/profile" element={<CustomerProfile />} />
        </Route>

        {/* Fallback - good practice */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
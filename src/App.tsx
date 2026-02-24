import { Routes, Route, useLocation } from "react-router-dom";
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
        </Route>

        {/* Technician Portal (separate layout later) */}
<Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
  <Route element={<TechnicianLayout />}>
    <Route path="/technician" element={<TechnicianDashboard />} />
    <Route path="/technician/incoming" element={<IncomingRepairs />} />
    <Route path="/technician/active" element={<ActiveRepair />} />
  </Route>
</Route>
      </Routes>
    </AnimatePresence>
  );
}
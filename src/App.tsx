import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";


import Home from "./pages/Home";
import Repair from "./pages/Repair";
import Shop from "./pages/Shop";
import Chats from "./pages/Chats";
import Login from "./pages/Login";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repair" element={<Repair />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MainLayout>
  );
}

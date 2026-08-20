import React from "react";  
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import EquipmentList from "./pages/EquipmentList";
import EquipmentDetail from "./pages/EquipmentDetail";
import ListEquipment from "./pages/ListEquipment";
import MyEquipment from "./pages/MyEquipment";
import MyRentals from "./pages/MyRentals";
import TransportRegister from "./pages/TransportRegister";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HelperRequests from "./pages/HelperRequests";
import TransportList from "./pages/TransportList";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEquipment from "./pages/AdminEquipment";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN PROTECTED ROUTE */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/equipment" element={<AdminEquipment />} />

        {/* NORMAL PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              <EquipmentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/equipment/:id"
          element={
            <ProtectedRoute>
              <EquipmentDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/list-equipment"
          element={
            <ProtectedRoute>
              <ListEquipment />
            </ProtectedRoute>
          }
        />
<Route
  path="/my-equipment"
  element={
    <ProtectedRoute>
      <MyEquipment />
    </ProtectedRoute>
  }
/>
        <Route
          path="/my-rentals"
          element={
            <ProtectedRoute>
              <MyRentals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transport-register"
          element={
            <ProtectedRoute>
              <TransportRegister />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transport-requests"
          element={
            <ProtectedRoute>
              <HelperRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transport"
          element={
            <ProtectedRoute>
              <TransportList />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
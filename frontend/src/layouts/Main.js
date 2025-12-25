import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";
import ListingGrid from "./ListingGrid";
import DetailProduct from "./DetailProduct";
import Profile from "./Profile";
import ProfileAddress from "./ProfileAddress";
import ProfileOrders from "./ProfileOrders";
import ProfileSettings from "./ProfileSettings";
import Logout from "./Logout";
import Cart from "./Cart";
import Checkout from "./Checkout";
import ChangePassword from "./ChangePassword";
import PaymentResult from "./PaymentResult";
import PaymentSuccess from "./PaymentSuccess";
import PaymentCancel from "./PaymentCancel";

// Admin Components
import AdminLayout from "../pages/admin/AdminLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import ProductsPage from "../pages/admin/ProductsPage";
import About from "../pages/home/About";
import Contact from "../pages/home/Contact";
import News from "../pages/home/News";
import Products from "../pages/Products";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  const isAdmin = true; // Trong thực tế, kiểm tra role từ token

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Main = () => (
  <main className="main">
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<UserLogin />} />
      <Route path="/Register" element={<UserRegister />} />
      <Route path="/ListingGrid" element={<ListingGrid />} />
      <Route path="/Detail" element={<DetailProduct />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/address" element={<ProfileAddress />} />
      <Route path="/profile/orders" element={<ProfileOrders />} />
      <Route path="/profile/settings" element={<ProfileSettings />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/Cart" element={<Cart />} />
      <Route path="/Checkout" element={<Checkout />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
      <Route path="/Change-password" element={<ChangePassword />} />
      <Route path="/shop/orders/success" element={<PaymentResult />} />
      <Route path="/shop/orders/cancel" element={<PaymentResult />} />
      <Route path="/About" element={<About />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/News" element={<News />} />
      <Route path="/products" element={<Products />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        {/* Thêm các route admin khác ở đây */}
      </Route>
      
      {/* Redirect to home for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </main>
);

export default Main;

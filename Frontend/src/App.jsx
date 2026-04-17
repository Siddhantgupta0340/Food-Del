import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";

// ✅ TOAST IMPORT
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// ✅ PAGES
import Home from "./pages/Home/home";
import Cart from "./pages/cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import Profile from "./pages/Profile/Profile"; // ✅ ADD THIS

// ✅ COMPONENTS
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* ✅ TOAST (VERY IMPORTANT) */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ✅ LOGIN POPUP */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />

          {/* ✅ PROFILE ROUTE (IMPORTANT) */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/storeContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  // ✅ NAVIGATE TO ORDERS (FIXED)
  const goToOrders = () => {
    navigate("/myorders"); // 👈 route should exist
  };

  return (
    <div className="navbar">
      {/* LOGO */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>

      {/* MENU */}
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>

        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>

        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>

        <a
          href="#footer"
          onClick={() => setMenu("contact")}
          className={menu === "contact" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>

      {/* RIGHT SECTION */}
      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />

        {/* CART */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {/* AUTH SECTION */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />

            {/* DROPDOWN */}
            <ul className="navbar-profile-dropdown">
              {/* ✅ FIXED ORDERS CLICK */}
              <li onClick={goToOrders}>
                <img src={assets.bag_icon} alt="orders" />
                <p>My Orders</p>
              </li>

              <hr />

              <li onClick={logout}>
                <img src={assets.logout_icon} alt="logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

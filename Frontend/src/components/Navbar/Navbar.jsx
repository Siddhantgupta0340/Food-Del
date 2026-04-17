import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/storeContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken, user } =
    useContext(StoreContext);

  const navigate = useNavigate();

  // ✅ CLEAN LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const goToOrders = () => navigate("/myorders");
  const goToProfile = () => navigate("/profile");

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>

      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>

        <a href="#explore-menu">Menu</a>
        <a href="#app-download">Mobile App</a>
        <a href="#footer">Contact</a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            {/* 🔥 USER NAME FIX */}
            <p className="navbar-username">
              Hi, {user?.name ? user.name : "User"}
            </p>

            <img src={assets.profile_icon} alt="profile" />

            <ul className="navbar-profile-dropdown">
              <li onClick={goToProfile}>
                <img src={assets.profile_icon} alt="" />
                <p>Profile</p>
              </li>

              <hr />

              <li onClick={goToOrders}>
                <img src={assets.bag_icon} alt="" />
                <p>My Orders</p>
              </li>

              <hr />

              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
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

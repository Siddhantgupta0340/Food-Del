import React from "react";
import "./Header.css";
const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Your cravings matter! Order your favourite food here and treat
          yourself to fresh, tasty, and fast-delivered meals.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;

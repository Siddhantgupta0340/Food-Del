import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/storeContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div className="food-item">
      {/* ✅ CLOUDINARY IMAGE (NO URL CONCAT) */}
      <img src={image} alt={name} />

      <div className="food-item-info">
        <h3>{name}</h3>
        <p>{description}</p>

        <div className="food-item-footer">
          <span>₹{price}</span>

          {!cartItems[id] ? (
            <button onClick={() => addToCart(id)}>Add</button>
          ) : (
            <div className="food-item-counter">
              <button onClick={() => removeFromCart(id)}>-</button>
              <span>{cartItems[id]}</span>
              <button onClick={() => addToCart(id)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;

import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/storeContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  return (
    <div className="food-item">
      <img src={url + "/images/" + image} alt={name} />

      <div className="food-item-info">
        <h3>{name}</h3>
        <p>{description}</p>

        <div className="food-item-footer">
          <span>₹{price}</span>

          {!cartItems[id] ? (
            // 👉 ADD BUTTON
            <button onClick={() => addToCart(id)}>Add</button>
          ) : (
            // 👉 QUANTITY CONTROLS
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

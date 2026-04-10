import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // ✅ INPUT HANDLER
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ PLACE ORDER + RAZORPAY
  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Please login first ❌");
      return;
    }

    let orderItems = [];

    // ✅ FIXED LOOP
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    console.log("FORM DATA:", data);

    try {
      // ✅ FIXED axios.post
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (!response.data.success) {
        alert("Order failed ❌");
        return;
      }

      const { orderId, amount, key, dbOrderId } = response.data;

      // ✅ RAZORPAY OPTIONS
      const options = {
        key,
        amount,
        currency: "INR",
        name: "Food App",
        description: "Food Order Payment",
        order_id: orderId,

        // ✅ FIX CORS ERROR (IMPORTANT)
        image: "https://dummyimage.com/200x200/000/fff",

        handler: async function (res) {
          try {
            console.log("RAZORPAY RESPONSE:", res);

            const verifyRes = await axios.post(
              url + "/api/order/verify",
              {
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
                orderId: dbOrderId,
              },
              {
                headers: { token },
              },
            );

            console.log("VERIFY RESPONSE:", verifyRes.data);

            if (verifyRes.data.success) {
              alert("Payment Successful ✅");
              window.location.href = "/";
            } else {
              alert("Payment Failed ❌");
            }
          } catch (error) {
            console.log(error);
            alert("Verification failed ❌");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* LEFT SIDE */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>

        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />

        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />

        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>

        <div className="multi-fields">
          <input
            required
            name="zipCode"
            onChange={onChangeHandler}
            value={data.zipCode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>

        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

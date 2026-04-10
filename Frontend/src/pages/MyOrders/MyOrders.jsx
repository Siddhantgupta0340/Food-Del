import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ TRACK POPUP

  // ✅ FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
    }
  };

  // ✅ AUTO REFRESH
  useEffect(() => {
    if (token) {
      fetchOrders();

      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // ✅ STATUS STEPS
  const steps = [
    "Pending",
    "Food Processing",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="orders-container">
        {orders.length === 0 ? (
          <p className="no-orders">No Orders Found ❌</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* ICON */}
              <img src={assets.parcel_icon} alt="" />

              {/* DETAILS */}
              <div className="order-details">
                <p className="order-items">
                  {order.items.map((item, i) =>
                    i === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>

                <p className={`order-status status-${order.status}`}>
                  ● Order: {order.status}
                </p>

                <p className={`payment-status pay-${order.paymentStatus}`}>
                  💳 Payment: {order.paymentStatus}
                </p>
              </div>

              <p className="order-price">₹{order.amount}</p>
              <p className="order-count">Items: {order.items.length}</p>

              {/* ✅ TRACK BUTTON */}
              <button
                className="track-btn"
                onClick={() => setSelectedOrder(order)}
              >
                Track Order
              </button>
            </div>
          ))
        )}
      </div>

      {/* ✅ TRACK POPUP */}
      {selectedOrder && (
        <div className="track-popup">
          <div className="track-box">
            <h3>Order Tracking</h3>

            <div className="track-steps">
              {steps.map((step, index) => {
                const currentIndex = steps.indexOf(selectedOrder.status);

                return (
                  <div
                    key={index}
                    className={`step ${
                      index <= currentIndex ? "active" : ""
                    }`}
                  >
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </div>
                );
              })}
            </div>

            <button
              className="close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
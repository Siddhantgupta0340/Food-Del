import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");

    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: newStatus,
    });

    if (response.data.success) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success("Updated ✅");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order">
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="" />

            <div>
              <p>
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? item.name + " x " + item.quantity
                    : item.name + " x " + item.quantity + ", ",
                )}
              </p>

              <p>
                {order.address?.firstName} {order.address?.lastName}
              </p>

              <p>
                {order.address?.city}, {order.address?.state}
              </p>

              <p>{order.address?.phone}</p>
            </div>

            <p>Items: {order.items.length}</p>
            <p>₹{order.amount}</p>

            <p>💳 {order.paymentStatus}</p>

            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
            >
              <option value="Pending">Pending</option>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

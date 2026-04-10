import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);

  const [data, setData] = useState([]); // ✅ FIXED

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders", // ✅ FIXED
        {},
        { headers: { token } },
      );

      console.log("ORDERS:", response.data);

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="container">
        {data.length === 0 ? (
          <p>No Orders Found ❌</p>
        ) : (
          data.map((order, index) => {
            return (
              <div key={index} className="my-orders-order">
                <img src={assets.parcel_icon} alt="" />

                {/* ✅ FIXED ITEMS */}
                <p>
                  {order.items.map((item, i) => {
                    if (i === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>

                <p>₹{order.amount}</p>
                <p>Items: {order.items.length}</p>

                <p>
                  <span>&#x25cf;</span> {order.status}
                </p>

                <button>Track Order</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;

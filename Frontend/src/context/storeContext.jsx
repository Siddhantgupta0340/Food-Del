import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

  // ✅ FINAL BACKEND URL
  const url = "https://food-del-backend-9hm2.onrender.com";

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);

  const [user, setUser] = useState(null);

  const fetchUser = async (token) => {
    try {
      const res = await axios.post(
        url + "/api/user/profile",
        {},
        { headers: { token } },
      );

      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.log("User fetch error", error);
    }
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } },
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } },
      );
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      const itemInfo = food_list.find(
        (product) => product._id.toString() === item.toString(),
      );

      if (itemInfo) {
        total += itemInfo.price * cartItems[item];
      }
    }

    return total;
  };

 const fetchFoodList = async () => {
  try {
    const response = await axios.get(url + "/api/food/list");

    if (response.data.success) {
      setFoodList(response.data.data);
    } else {
      setFoodList([]);
    }
  } catch (error) {
    console.log("❌ Food fetch error:", error);
    setFoodList([]);
  }
};

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } },
    );
    setCartItems(response.data.cartData || {});
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
        await fetchUser(savedToken);
      }
    }

    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser,
    fetchUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

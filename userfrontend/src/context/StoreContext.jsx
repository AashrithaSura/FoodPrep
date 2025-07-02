// src/context/StoreContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const url = "https://foodprepbackend-53br.onrender.com";

  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(null);
  const [showLogin, setShowLogin] = useState(false); 

 
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data.data);
    } catch (err) {
      console.error("Error fetching food list:", err.response?.data || err.message);
    }
  };

  // Load cart data if token exists
  const loadCartData = async (token) => {
    try {
      const res = await axios.get(`${url}/api/cart/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(res.data.cartData || {});
    } catch (err) {
      console.error("Error loading cart:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.id || decoded._id);
          await loadCartData(token);
        } catch (err) {
          console.error("Invalid token:", err);
          setUserId(null);
        }
      }
    };
    loadData();
  }, [token]);

  const addToCart = async (itemId) => {
    if (!token) {
      setShowLogin(true); 
      return;
    }

    try {
      await axios.post(`${url}/api/cart/add`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadCartData(token);
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      await axios.delete(`${url}/api/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { itemId },
      });
      await loadCartData(token);
    } catch (err) {
      console.error("Remove from cart failed:", err.response?.data || err.message);
    }
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
      const foodItem = food_list.find((item) => item._id === itemId);
      return foodItem ? total + foodItem.price * qty : total;
    }, 0);
  };

  const contextValue = {
    cartItems,
    setCartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    userId,
    setUserId,
    showLogin,
    setShowLogin,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const StoreContext = createContext();

const StoreContextProvider = ({ children, setShowLogin }) => {
  const url = "https://foodprepbackend-53br.onrender.com";

  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(null);

  // Fetch food list
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data.data || []);
    } catch (err) {
      console.error("Error fetching food list:", err.response?.data || err.message);
    }
  };

  // Load cart data from backend
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

  // On mount: fetch food list, decode token, load cart
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.id || decoded._id || null);
          await loadCartData(token);
        } catch (err) {
          console.error("Invalid token:", err.message);
          setUserId(null);
        }
      }
    };
    loadData();
  }, [token]);

  // Add to cart
  const addToCart = async (itemId) => {
    if (!token) {
      setShowLogin?.(true);
      return;
    }
    try {
      await axios.post(`${url}/api/cart/add`, { itemId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await loadCartData(token);
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    if (!token) {
      setShowLogin?.(true);
      return;
    }
    try {
      await axios.delete(`${url}/api/cart/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { itemId },
      });
      await loadCartData(token);
    } catch (err) {
      console.error("Remove from cart failed:", err.response?.data || err.message);
    }
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const foodItem = food_list.find((item) => item._id === itemId);
      if (foodItem) {
        total += foodItem.price * cartItems[itemId];
      }
    }
    return total;
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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

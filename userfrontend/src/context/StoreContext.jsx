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


  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch food list:", err.response?.data || err.message);
    }
  };

  // Load cart items if logged in
  const loadCartData = async (token) => {
    try {
      const res = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cartData || {});
    } catch (err) {
      console.error("Failed to load cart:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const decoded = jwtDecode(storedToken);
          setUserId(decoded.id || decoded._id);
        } catch (err) {
          console.error("Token decode error:", err);
          setUserId(null);
        }
      } else {
        const localCart = localStorage.getItem("cartItems");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (token) loadCartData(token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId) => {
    if (!token) {
      alert("Please login to add to cart");
      return;
    }
    try {
      const res = await axios.post(`${url}/api/cart/add`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cartItems);
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
    }
  };

    const removeFromCart = async (itemId) => {
    if (!token) {
      alert("Please login to remove from cart");
      return;
    }

    try {
      const res = await axios.post(`${url}/api/cart/remove`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cartItems);
    } catch (err) {
      console.error("Remove from cart failed:", err.response?.data || err.message);
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (let itemId in cartItems) {
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

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

  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data);
    } catch (err) {
      console.error("Error fetching food list:", err.response?.data || err.message);
    }
  };

  // Load cart items from server
  const loadCartData = async (token) => {
    try {
      const res = await axios.post(`${url}/api/cart/get`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cartItems || {});
    } catch (err) {
      console.error("Error loading cart:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const tokenFromStorage = localStorage.getItem("token");

      if (tokenFromStorage) {
        setToken(tokenFromStorage);
        try {
          const decoded = jwtDecode(tokenFromStorage);
          setUserId(decoded.id || decoded._id); 
        } catch (err) {
          console.error("Token decode failed", err);
          setUserId(null);
        }

        loadCartData(tokenFromStorage);
      } else {
        const localCart = localStorage.getItem("cartItems");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    };
    loadData();
  }, []);

  // Add to cart
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

  // Remove from cart
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
    setUserId
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

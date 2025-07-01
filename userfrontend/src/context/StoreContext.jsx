import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext();

const StoreContextProvider = ({ children, setShowLogin }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(null);
  const [food_list, setFoodList] = useState([]);
  const url = "https://foodprepbackend-53br.onrender.com";

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch food list:", error.response?.data || error.message);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data:", error.response?.data || error.message);
      setCartItems({});
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const tokenFromStorage = localStorage.getItem("token");
      if (tokenFromStorage) {
        setToken(tokenFromStorage);
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
      setShowLogin(true);
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to add item to cart:", error.response?.data || error.message);
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        await axios.delete(`${url}/api/cart/remove?itemId=${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to remove item from cart:", error.response?.data || error.message);
      }
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (let itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((food) => food._id === itemId);
        if (item) {
          total += item.price * cartItems[itemId];
        }
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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
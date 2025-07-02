import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Profile from "./components/Profile/Profile";
import ProfileSaved from "./components/ProfileSaved/ProfileSaved";
import Settings from "./components/Settings/Settings";
import StoreContextProvider from "./context/StoreContext";

import Home from "./screens/Home/Home";
import Cart from "./screens/Cart/Cart";
import PlaceOrder from "./screens/PlaceOrder/PlaceOrder";
import MyOrders from "./screens/MyOrders/MyOrders";
import Verify from "./screens/Verify/Verify";
import ExploreMenu from "./components/ExploreMenu/ExploreMenu";
 

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showOnlyFooter, setShowOnlyFooter] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();

  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit");
    if (!token && !firstVisit) {
      setShowLogin(true);
      localStorage.setItem("firstVisit", "true");
    }
    setShowOnlyFooter(false);
  }, [token, location.pathname]);

  return (
    <StoreContextProvider setShowLogin={setShowLogin}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      {showLogin && (
        <LoginPopup setShowLogin={setShowLogin} forceLogin={!token} />
      )}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} setShowOnlyFooter={setShowOnlyFooter} />
        
        {showOnlyFooter ? (
          <div className="footer-only-view">
            <Footer />
          </div>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<ExploreMenu category="All" setCategory={() => {}} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile-saved" element={<ProfileSaved />} />
              <Route path="/settings" element={<Settings />} />

            </Routes>
            {location.pathname === "/" && <Footer />}
          </>
        )}
      </div>
    </StoreContextProvider>
  );
};

export default App;
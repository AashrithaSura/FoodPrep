import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./LoginPopup.css";
import { toast } from "react-toastify";

const LoginPopup = ({ url}) => {
  const { setAdmin, setToken, setLoginPopup } = useContext(StoreContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/login`, data);
      const role = response.data.user.role;

      if (role === "admin") {
        setAdmin(true);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", "true");
        toast.success("Logged in as admin!");
        setLoginPopup(false); 
      } else {
        toast.error("Access denied. Not an admin.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Login</h2>
        </div>
        <form onSubmit={handleLogin} className="login-popup-inputs">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button 
          onClick={() => setLoginPopup(false)} 
          className="cancel-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
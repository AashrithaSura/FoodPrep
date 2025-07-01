import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Add from './screens/Add/Add';
import List from './screens/List/List';
import Orders from './screens/Orders/Orders';
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Logout from './components/Logout/Logout';
import './App.css';
import { StoreContext } from './context/StoreContext'; 

const url = 'hhttps://food-prep-ewf4.onrender.com//';

const App = () => {
  const { loginPopup } = useContext(StoreContext); 

  return (
    <div className="app">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Add url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/logout" element={<Logout url={url} />} />
        </Routes>
      </div>

      {loginPopup && <LoginPopup url={url} />}
    </div>
  );
};

export default App;

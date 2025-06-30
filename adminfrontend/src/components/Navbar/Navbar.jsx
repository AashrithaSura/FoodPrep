import React, { useContext } from 'react';
import './Navbar.css';
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { admin } = useContext(StoreContext);

  return (
    <div className="navbar">
      <img className="logo" src="/logo.png" alt="logo" />
      <div className="navbar-right">
        {admin && (
          <Link to="/logout">
            <button className="logout-btn">Logout</button>
          </Link>
        )}
        <img src="/profile_image.png" alt="profile" className="profile" />
      </div>
    </div>
  );
};

export default Navbar;

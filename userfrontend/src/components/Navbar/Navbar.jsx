import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');

  return (
    <div className='navbar'>
      <Link to='/' onClick={() => setMenu("home")}>
        <img className='logo' src={assets.logo} alt="" />
      </Link>
      <ul className='navbar-menu'>
        <li>
          <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        </li>
        <li>
          <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        </li>
        <li>
          <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
        </li>
      </ul>
      <div className='navbar-right'>
        <div className='navbar-basket-icon'>
          <Link to='/Cart'>
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className='dot'></div>
        </div>
        <button onClick={() => setShowLogin(true)}>Sign in</button>
      </div>
    </div>
  );
}

export default Navbar;
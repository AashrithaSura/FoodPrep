import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="navbar">
            <img className="logo" src="/logo.png" alt="" />
            <img src="/profile_image.png" alt="" className="profile" />
        </div>
    )
}
export default Navbar;
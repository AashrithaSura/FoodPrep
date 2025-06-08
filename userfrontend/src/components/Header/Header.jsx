import React from 'react';
import './Header.css';

const Header = () => {

  return (
    <div className="header">
      <div className="header-contents">
        <h3>Order your favorite food here.</h3>
        <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest 
        ingredients and culinary expertise.Our mission is to satisfy your cravings and elevate our dining 
        experience. Whether you're in the mood for a quick bite or a leisurely meal, we have something to tantalize
        your taste buds.</p>
        <button>View Menu</button>
      </div>
    </div>
  )
}

export default Header
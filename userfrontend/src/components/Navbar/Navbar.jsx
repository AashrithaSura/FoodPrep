import { useState, useContext } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowOnlyFooter }) => {
  const [menu, setMenu] = useState('home');
  const { getTotalCartAmount,setCartItems, token, setToken,setShowLogin } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
    setCartItems({})

  };

  const handleHomeClick = () => {
    setMenu('home');
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleMenuClick = () => {
    setMenu('menu');
    navigate('/menu'); 
  };

  const handleContactClick = () => {
    setMenu('contact');
    setShowOnlyFooter(true);
  };

  return (
    <div className="navbar">
      <Link to='/'><img className='logo' src={assets.logo} alt="Logo" /></Link>

      <ul className='navbar-menu'>
        <li onClick={handleHomeClick} className={menu === 'home' ? 'active' : ''}>
          <Link to='/'>
            <img src={assets.home_icon} alt="Home" />
            <span>Home</span>
          </Link>
        </li>

        <li onClick={handleMenuClick} className={menu === 'menu' ? 'active' : ''}>
          <Link to='/menu'>
            <img src={assets.menu_icon} alt="Menu" />
            <span>Menu</span>
          </Link>
        </li>

      <li onClick={() => setMenu('contact')} className={menu === 'contact' ? 'active' : ''}>
        <a onClick={handleContactClick} className="contact-link" style={{ cursor: 'pointer' }}>
          <img src={assets.contact_icon} alt="Contact" />
          <span>Contact</span>
        </a>
       </li>

        <li onClick={() => setMenu('orders')} className={menu === 'orders' ? 'active' : ''}>
          <Link to='/myorders'>
            <img src={assets.orders_icon} alt="Orders" />
            <span>Orders</span>
          </Link>
        </li>
      </ul>

      <div className="navbar-right">
        <div className="navbar-basket-icon">
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="Basket" />
          </Link>
          {(token && getTotalCartAmount() !== 0) && <div className="dot"></div>}
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile} alt="Profile" />
            <ul className='nav-profile-dropdown'>
              <li>
                <Link to="/profile">
                  <img src={assets.user_icon} alt="Profile" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <img src={assets.settings_icon} alt="Settings" />
                  <span>Settings</span>
                </Link>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
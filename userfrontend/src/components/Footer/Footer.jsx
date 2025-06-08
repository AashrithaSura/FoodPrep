// Footer.jsx
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-left">
          <img src={assets.logo_bottom} alt="FoodPrep Logo" className="footer-logo"/>
          <p className="footer-description">
            FoodPrep delivers delicious meals straight to your door. 
            Explore a curated menu of chef-crafted dishes, made with fresh ingredients.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
            <img src={assets.twitter_icon} alt="Twitter" />
          </div>
        </div>
        
        <div className="footer-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Courses</li>
            <li>Reviews</li>
          </ul>
        </div>
        
        <div className="footer-right">
          <h2>Contact Us</h2>
          <ul>
            <li>+91 8522027220</li>
            <li>surak638@gmail.com</li>
          </ul>
        </div>
      </div>
      
      <hr className="footer-divider" />
      <p className='footer-copyright'>© 2025 FoodPrep. All Rights Reserved.</p>
    </div>
  )
}

export default Footer;
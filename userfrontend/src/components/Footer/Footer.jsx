import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-left">
          <img src={assets.logo_bottom} alt="FoodPrep Logo" className="footer-logo"/>
          <p className="footer-description">
            Elevate your dining experience with FoodPrep - where gourmet meets convenience. 
            Our chef-inspired meals are crafted with locally-sourced, seasonal ingredients.
          </p>
          <div className="footer-social-icons">
            <a href="#"><img src={assets.facebook_icon} alt="Facebook" /></a>
            <a href="#"><img src={assets.instagram_icon} alt="Instagram" /></a>
            <a href="#"><img src={assets.linkedin_icon} alt="LinkedIn" /></a>
            <a href="#"><img src={assets.twitter_icon} alt="Twitter" /></a>
          </div>
        </div>
        <div className="footer-center">
          <h2>QUICK LINKS</h2>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Our Menu</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">Testimonials</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-right">
          <h2>CONTACT INFO</h2>
          <ul>
            <li><a><img src={assets.phone} alt="Phone" /> +91 8522027220</a></li>
            <li><a><img src={assets.email} alt="Email" /> surak638@gmail.com</a></li>
            <li><a><img src={assets.location} alt="Location" /> Banjara Hills,Hyderabad,Telangana</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <hr className="footer-divider" />
        <div className="footer-copyright">
          <p>© 2025 FoodPrep. All Rights Reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useEffect, useState } from 'react';
import './Settings.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiBell, 
  FiGift, 
  FiMail, 
  FiSettings, 
  FiUser, 
  FiSun, 
  FiMoon 
} from 'react-icons/fi';
import { assets } from '../../assets/assets';
const foodQuestions = [
  {
    id: 1,
    question: "What's your favorite cuisine?",
    options: ["Italian 🍝", "Mexican 🌮", "Japanese 🍜", "Indian 🍛"]
  },
  {
    id: 2,
    question: "How often do you order food?",
    options: ["Daily 🍽️", "Weekly 📅", "Monthly 🗓️", "Rarely ⏳"]
  },
  {
    id: 3,
    question: "What's your go-to comfort food?",
    options: ["Pizza 🍕", "Burger 🍔", "Pasta 🍝", "Ice Cream 🍨"]
  }
];
  const getIconForType = (type) => {
    switch(type) {
      case 'success': return '🎉';
      case 'warning': return '⚠️';
      case 'dark': return '🎁';
      default: return '🔔';
    }
  };

const promotions = [
  { id: 1, message: "🍕 New menu added: Pizza, Burger, Beverages!", type: "info" },
  { id: 2, message: "🧋 Try our new arrival: Classic Bubble Tea", type: "success" },
  { id: 3, message: "🍬 Coming soon: Macarons!", type: "warning" },
  { id: 4, message: "🎁 First order promos: FREESHIP, SAVE10, FIXED50", type: "dark" },
  { id: 5, message: "🍣 Sushi Wednesday! 20% off all sushi today", type: "info" },
  { id: 6, message: "🥗 Healthy meal options now available!", type: "success" }
];

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    offers: true,
    emailNotifications: true,
    sound: false,
    theme: 'light'
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [currentFoodQuestion, setCurrentFoodQuestion] = useState(0);
  const [selectedFoodAnswer, setSelectedFoodAnswer] = useState(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userSettings'));
    const savedTheme = stored?.theme || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (stored) {
      setSettings(prev => ({
        ...prev,
        ...stored,
        theme: savedTheme
      }));
    }

    if (stored?.notifications || !stored) {
      showRandomPromotion();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const updated = { ...settings, [name]: val };
    
    setSettings(updated);
    localStorage.setItem('userSettings', JSON.stringify(updated));

    if (name === 'theme') {
      document.documentElement.setAttribute('data-theme', value);
    }
  };

   const showRandomPromotion = () => {
  if (!settings.notifications) return;
  
  const randomIndex = Math.floor(Math.random() * promotions.length);
  const promo = promotions[randomIndex];

  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: settings.theme,
    className: 'large-font-toast'
  };

  switch(promo.type) {
    case 'success':
      toast.success(promo.message, toastOptions);
      break;
    case 'warning':
      toast.warning(promo.message, toastOptions);
      break;
    case 'dark':
      toast.dark(promo.message, toastOptions);
      break;
    default:
      toast.info(promo.message, toastOptions);
  }
};

const handleTestNotification = () => {
  toast.info("🔔 This is a test notification", {
    position: "top-right",
    autoClose: 3000,
    theme: settings.theme,
    className: 'large-font-toast'
  });
};

  const handleFoodPreferenceSelect = (answer) => {
    setSelectedFoodAnswer(answer);
    toast.success(`Thanks! We'll recommend more ${answer.split(' ')[0]} options`, {
      position: "top-right",
      autoClose: 3000
    });
    
    setTimeout(() => {
      setSelectedFoodAnswer(null);
      setCurrentFoodQuestion((prev) => (prev + 1) % foodQuestions.length);
    }, 3500);
  };

  const dismissUpdateBanner = () => {
    setShowUpdateBanner(false);
    localStorage.setItem('hideUpdateBanner', 'true');
  };

  return (
    <div className="settings-page">
      {showUpdateBanner && !localStorage.getItem('hideUpdateBanner') && (
        <div className="update-banner">
          <div className="update-content">
            <img src={assets.app_icon} alt="App Icon" className="app-icon" />
            <div>
              <h4>New App Version Coming Soon!</h4>
              <p>Exciting new features and improved performance</p>
            </div>
          </div>
          <button onClick={dismissUpdateBanner} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      <div className="settings-header">
        <FiSettings className="settings-icon" />
        <h2>Account Settings</h2>
      </div>

      <div className="settings-tabs">
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FiBell /> Notifications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <FiUser /> Preferences
        </button>
      </div>

      {activeTab === 'notifications' && (
        <div className="settings-content">
          <div className="settings-section card">
            <h3><FiBell /> Notification Settings</h3>
            <label className="setting-item">
              <div className="setting-info">
                <span>Push Notifications</span>
                <small>Receive app notifications</small>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </label>

            <label className="setting-item">
              <div className="setting-info">
                <span>Email Notifications</span>
                <small>Get updates via email</small>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </label>

            <label className="setting-item">
              <div className="setting-info">
                <span>Special Offers</span>
                <small>Discounts and promotions</small>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  name="offers"
                  checked={settings.offers}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </label>

            <button className="test-btn" onClick={handleTestNotification}>
              Test Notification
            </button>
          </div>

          <div className="notifications-preview card">
            <h3><FiMail /> Latest Promotions</h3>
            <ul>
              {promotions.slice(0, 4).map(p => (
                <li key={p.id} className={`promo-item ${p.type}`}>
                  <span className="promo-icon">{getIconForType(p.type)}</span>
                  {p.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="settings-content">
          <div className="settings-section card">
            <h3><FiUser /> User Preferences</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <span>Sound Effects</span>
                <small>Enable interface sounds</small>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  name="sound"
                  checked={settings.sound}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span>App Theme</span>
                <small>Choose light or dark mode</small>
              </div>
              <div className="theme-toggle">
                <button
                  className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleChange({ target: { name: 'theme', value: 'light' } })}
                >
                  <FiSun /> Light
                </button>
                <button
                  className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleChange({ target: { name: 'theme', value: 'dark' } })}
                >
                  <FiMoon /> Dark
                </button>
              </div>
            </div>

            <div className="food-preference">
              <h4>Food Preferences</h4>
              <p>{foodQuestions[currentFoodQuestion].question}</p>
              <div className="food-options">
                {foodQuestions[currentFoodQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    className={`food-option ${selectedFoodAnswer === option ? 'selected' : ''}`}
                    onClick={() => handleFoodPreferenceSelect(option)}
                    disabled={selectedFoodAnswer !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="app-update card">
            <h3><FiGift /> What's Coming</h3>
            <img src={assets.app_icon} alt="App Update" className="update-image" />
            <p>We're working hard on the next version of our app with exciting new features:</p>
            <ul>
              <li>🍽️ Personalized meal recommendations</li>
              <li>📱 Faster checkout process</li>
              <li>🗺️ Real-time order tracking</li>
              <li>🎉 Exclusive member rewards</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
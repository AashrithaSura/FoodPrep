import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import StarRating from '../StarRating/StarRating';
import './FoodCard.css';

const FoodCard = ({ _id, name, price, description, image }) => {
  const { addToCart } = useContext(StoreContext);
  const [rating, setRating] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const savedRatings = JSON.parse(localStorage.getItem("foodRatings") || "{}");
    if (savedRatings[_id]) {
      setRating(savedRatings[_id]);
    }
  }, [_id]);

  const handleRatingChange = (val) => {
    setRating(val);
    const savedRatings = JSON.parse(localStorage.getItem("foodRatings") || "{}");
    savedRatings[_id] = val;
    localStorage.setItem("foodRatings", JSON.stringify(savedRatings));
  };

  const handleAddToCart = () => {
    addToCart(_id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className={`food-card ${isAdded ? 'added-effect' : ''}`}>
      <div className='food-item'>
        <div className="food-item-image-container">
          <img 
            className='food-item-image' 
            src={`https://foodprepbackend-ju1g.onrender.com/uploads/${image}`} 
            alt={name}
            onError={(e) => {
              console.log('Failed to load image:', image);
              e.target.onerror = null;
              e.target.src = assets.placeholder_image;
            }}
          />
          {isAdded && (
            <div className="added-confirmation">
              <div className="stars-animation">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="star" style={{
                    '--delay': `${i * 0.1}s`,
                    '--angle': `${i * 72}deg`
                  }}>★</div>
                ))}
              </div>
              <p>Added to cart!</p>
            </div>
          )}
        </div>
        <div className="food-item-info">
          <div className="food-item-top">
            <p className="food-item-name"><strong>{name}</strong></p>
            <StarRating 
              rating={rating} 
              onRate={handleRatingChange} 
              size={16} 
              readOnly={false}
            />
          </div>
          <div 
            className={`food-item-desc-container ${showFullDesc ? 'show-full' : ''}`}
            onClick={() => isMobile && setShowFullDesc(!showFullDesc)}
          >
            <p className="food-item-desc"><strong>{description}</strong></p>
            
          </div>
          <div className="food-item-bottom">
            <p className="food-item-price"><strong>₹{price}</strong></p>
            <div className="slide-up-panel">
              <button 
                className="add-to-cart-button"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
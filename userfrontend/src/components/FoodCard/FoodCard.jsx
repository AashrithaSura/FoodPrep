import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import StarRating from '../StarRating/StarRating';
import './FoodCard.css';
import axios from 'axios';

const FoodCard = ({ _id, name, price, description, image, adminRating }) => {
  const { addToCart, userId, url } = useContext(StoreContext);
  const [rating, setRating] = useState(adminRating || 0);
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
    if (!userId) return;

    axios.get(`${url}/api/rating/user/${userId}`)
      .then(res => {
        const userRating = res.data.ratings.find(r => r.foodId === _id);
        if (userRating) setRating(userRating.rating);
      })
      .catch(err => console.error("Failed to fetch user rating", err));
  }, [userId, _id]);

  const handleRatingChange = (val) => {
    if (!userId) {
      alert("Please log in to rate.");
      return;
    }

    setRating(val); 

    axios.post(`${url}/api/rating`, {
      userId,
      foodId: _id,
      rating: val
    }).catch(err => {
      console.error("Rating submission failed", err);
    });
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
            src={`https://foodprepbackend-53br.onrender.com/uploads/${image}`} 
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
              readOnly={!userId}
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

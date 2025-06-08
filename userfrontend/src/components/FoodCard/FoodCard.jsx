import './FoodCard.css';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const FoodCard = ({ _id, name, price, description, image }) => {
    const { cartItems, setCartItems, addToCart, removeFromCart } = useContext(StoreContext);

    // Example of using setCartItems directly
    const handleResetItem = () => {
        setCartItems(prev => {
            const newCart = {...prev};
            delete newCart[_id]; // Remove this item completely
            return newCart;
        });
    };

    return (
        <div className='food-item'>
            <div className="food-item-image-container">
                <img className='food-item-image' src={image} alt={name} />
                {!cartItems[_id] ? (
                    <img 
                        onClick={() => addToCart(_id)} 
                        src={assets.add_icon_white} 
                        className='add' 
                        alt='Add to cart'
                    />
                ) : (
                    <div className="food-item-counter">
                        <img 
                            onClick={() => removeFromCart(_id)} 
                            src={assets.remove_icon_red}  
                            alt="Remove" 
                        />
                        <p>{cartItems[_id]}</p>
                        <img 
                            onClick={() => addToCart(_id)} 
                            src={assets.add_icon_green}  
                            alt="Add more" 
                        />
                        {/* Example button using setCartItems directly */}
                        <button onClick={handleResetItem} className="reset-btn">
                            Reset
                        </button>
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <p className="food-item-name">{name}</p>
                <p className="food-item-desc">{description}</p>
                <div className="food-item-price-rating">
                    <p className="food-item-price">₹{price}</p>
                    <img src={assets.rating_starts} alt="Rating" />
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
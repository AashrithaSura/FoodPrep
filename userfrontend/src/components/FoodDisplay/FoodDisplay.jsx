import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodCard from '../FoodCard/FoodCard';
import Loader from '../Loader/Loader'; 
import './FoodDisplay.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [displayItems, setDisplayItems] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(category);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true); 

  const filteredItems = food_list.filter(
    (item) => category === 'All' || category === item.category
  );

  useEffect(() => {
    if (!food_list.length) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    if (currentCategory !== category) {
      setIsTransitioning(true);
      setTimeout(() => {
        setDisplayItems(filteredItems);
        setCurrentCategory(category);
        setScrollPosition(0);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 300);
    } else {
      setDisplayItems(filteredItems);
    }
  }, [category, food_list]);

  const scrollLeft = () => {
    const container = document.getElementById('food-scroll-container');
    const newPosition = Math.max(0, scrollPosition - 350);
    setScrollPosition(newPosition);
    container.scrollLeft = newPosition;
  };

  const scrollRight = () => {
    const container = document.getElementById('food-scroll-container');
    const newPosition = scrollPosition + 350;
    setScrollPosition(newPosition);
    container.scrollLeft = newPosition;
  };

  if (isLoading) return <Loader />; 

  return (
    <div
      className={`food-display ${isTransitioning ? 'flip-transition' : ''}`}
      id="food-display"
    >
      <h2 className="display-title">
        {category === 'All' ? 'Top dishes near you' : `Best ${category} near you`}
        <span className="title-decoration"></span>
      </h2>

      <div className="food-display-container">
        {displayItems.length > 0 && (
          <button
            className="scroll-button left"
            onClick={scrollLeft}
            disabled={scrollPosition === 0}
          >
            <FaArrowLeft />
          </button>
        )}

        <div
          id="food-scroll-container"
          className={`food-display-list ${isTransitioning ? 'hidden' : ''}`}
        >
          {displayItems.map((item) => (
            <div className="food-card-wrapper" key={item._id}>
              <FoodCard
                _id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
                description={item.description}
              />
            </div>
          ))}
        </div>

        {displayItems.length > 0 && (
          <button
            className="scroll-button right"
            onClick={scrollRight}
            disabled={scrollPosition >= displayItems.length * 350 - 1200}
          >
            <FaArrowRight />
          </button>
        )}
      </div>

      {displayItems.length === 0 && !isTransitioning && (
        <div className="no-items-message">
          <p>No items found in this category. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;

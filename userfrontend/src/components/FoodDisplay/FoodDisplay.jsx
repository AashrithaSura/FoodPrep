
import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodCard from '../FoodCard/FoodCard';
import './FoodDisplay.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [displayItems, setDisplayItems] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(category);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  const filteredItems = useMemo(() => {
    return food_list.filter(item => category === 'All' || category === item.category);
  }, [food_list, category]);

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
        if (containerRef.current) {
          containerRef.current.scrollLeft = 0;
        }
        setTimeout(() => setIsTransitioning(false), 300);
      }, 300);
    } else {
      setDisplayItems(filteredItems);
    }
  }, [category, food_list, currentCategory, filteredItems]);

  const scrollLeft = () => {
    if (containerRef.current) {
      const newPosition = Math.max(0, containerRef.current.scrollLeft - 350);
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const newPosition = containerRef.current.scrollLeft + 350;
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className={`food-display ${isTransitioning ? 'flip-transition' : ''}`}>
      <h2 className="display-title">
        {category === 'All' ? 'Top dishes near you' : `Best ${category} near you`}
        <span className="title-decoration"></span>
      </h2>

      <div className="food-display-container">
        {displayItems.length > 0 && (
          <>
            <button
              className="scroll-button left"
              onClick={scrollLeft}
              disabled={scrollPosition === 0}
              aria-label="Scroll left"
            >
              <FaArrowLeft />
            </button>

            <div
              ref={containerRef}
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
                    adminRating={item.adminRating} // ✅ supports admin rating
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <button
              className="scroll-button right"
              onClick={scrollRight}
              disabled={scrollPosition >= displayItems.length * 350 - 1200}
              aria-label="Scroll right"
            >
              <FaArrowRight />
            </button>
          </>
        )}
      </div>

      {!isLoading && displayItems.length === 0 && !isTransitioning && (
        <div className="no-items-message">
          <p>No items found in this category. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;

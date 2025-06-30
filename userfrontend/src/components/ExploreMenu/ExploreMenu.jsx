import React, { useRef } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ExploreMenu = ({ category, setCategory }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 200;
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const handleCategoryChange = (newCategory) => {
    if (location.pathname === '/menu') {
      // If we're on the standalone menu page
      navigate('/', { 
        state: { selectedCategory: newCategory },
        replace: true
      });
      
      // Scroll to food display after navigation
      setTimeout(() => {
        const foodDisplaySection = document.getElementById('food-display');
        if (foodDisplaySection) {
          foodDisplaySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're on the home page
      setCategory(newCategory);
      setTimeout(() => {
        const foodDisplaySection = document.getElementById('food-display');
        if (foodDisplaySection) {
          foodDisplaySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1 className='explore-menu-title'>Explore Our Menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes.
        Our mission is to satisfy your cravings and elevate your dining experience.
      </p>

      <div className="explore-menu-wrapper">
        <button className="scroll-arrow left" onClick={() => scroll('left')}>
          <ChevronLeft size={28} />
        </button>

        <div className="explore-menu-scroll-wrapper" ref={scrollRef}>
          <div className='explore-menu-list'>
            {menu_list.map((item, index) => {
              const isActive = category === item.menu_name;
              return (
                <div
                  key={index}
                  className="explore-menu-list-item"
                  onClick={() => handleCategoryChange(isActive ? "All" : item.menu_name)}
                >
                  <div className={`menu-img-wrapper ${isActive ? 'active' : ''}`}>
                    <img src={item.menu_image} alt={item.menu_name} />
                  </div>
                  <p className={isActive ? 'active' : ''}>{item.menu_name}</p>
                </div>
              );
            })}
          </div>
        </div>

        <button className="scroll-arrow right" onClick={() => scroll('right')}>
          <ChevronRight size={28} />
        </button>
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
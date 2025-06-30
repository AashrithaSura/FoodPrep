import { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(goToNext, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, isAutoPlaying, goToNext]);

  const getOverlayClass = () => {
    const positions = [
      'first-slide-text',       
      'center-slide',           
      'top-left-slide',        
      'right-center-slide',    
      'center-right-slide'
    ];
    return positions[currentIndex] || 'middle-slide';
  };

  const getCustomText = () => {
    const currentSlide = slides[currentIndex];
    if (!currentSlide) return null;

    const defaultFirstSlideText = "Explore our curated selection of delicious dishes, crafted with the finest ingredients.";

    const textStyles = [
      {
        description: {
          fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)',
          fontWeight: '600',
          lineHeight: '1.4',
          color: 'white',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
        }
      },
      {
        title: { fontFamily: 'cursive', fontSize: 'clamp(2rem, 3.2vw, 3.2rem)' },
        description: { fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2vw, 2rem)' }
      },
      {
        title: { fontWeight: '800', fontSize: 'clamp(2rem, 3vw, 3rem)', letterSpacing: '2px' },
        description: { textTransform: 'uppercase', fontSize: 'clamp(1.2rem, 1.6vw, 1.6rem)' }
      },
      {
        title: { fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: '800', color: '#222' },
        description: { fontSize: 'clamp(1.5rem, 2.2vw, 2.2rem)', fontWeight: '600', color: '#444' }
      },
      {
        title: { fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: '800', fontFamily: 'serif', color: 'black'},
        description: { fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: '500', color: '#eee' }
      }
    ];

    const style = textStyles[currentIndex] || {};

    return (
      <>
        {currentSlide.title && <h2 style={style.title}>{currentSlide.title}</h2>}
        <p style={style.description}>
          {currentIndex === 0 && !currentSlide.description
            ? defaultFirstSlideText
            : currentSlide.description}
        </p>
      </>
    );
  };

  return (
    <div className="slider-container">
      <div className="slider">
        <button
          className="arrow left-arrow"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          ❰
        </button>
        <button
          className="arrow right-arrow"
          onClick={goToNext}
          aria-label="Next slide"
        >
          ❱
        </button>

        <div className="slide-wrapper">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.url})` }}
              aria-hidden={index !== currentIndex}
            >
              <div className={`slide-overlay ${getOverlayClass()}`}>
                {index === currentIndex && getCustomText()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;

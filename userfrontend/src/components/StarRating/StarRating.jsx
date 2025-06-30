// components/StarRating/StarRating.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ rating = 0, onRate = null, size = 20, readOnly = false }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const isActive = i <= rating;
    stars.push(
      <FaStar
        key={i}
        size={size}
        color={isActive ? '#FFD700' : '#ccc'}
        style={{ cursor: readOnly ? 'default' : 'pointer' }}
        onClick={!readOnly && onRate ? () => onRate(i) : undefined}
      />
    );
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;

import React from "react";
import "./StarRating.css"; // you can customize this
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onRate }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => {
        const filled = i < rating;
        return (
          <FaStar
            key={i}
            color={filled ? "#ffc107" : "#e4e5e9"}
            onClick={() => onRate(i + 1)}
            style={{ cursor: "pointer", fontSize: "20px" }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

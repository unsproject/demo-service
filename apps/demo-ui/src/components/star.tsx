import React from "react";

interface StarProps {
  filled: boolean;
}

const Star: React.FC<StarProps> = ({ filled }) => (
  <span style={{ color: filled ? "gold" : "gray", display: "inline-block" }}>
    ★
  </span>
);

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
}) => {
  return (
    <div style={{ cursor: "default" }}>
      {[...Array(totalStars)].map((_, index) => (
        <Star key={index} filled={index < rating} />
      ))}
    </div>
  );
};

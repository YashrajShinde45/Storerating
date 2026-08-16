const RatingStars = ({ rating }) => {
  const numRating = Number(rating) || 0;
  return (
    <span>
      {"★".repeat(Math.min(5, Math.max(0, numRating)))}
      {"☆".repeat(Math.min(5, Math.max(0, 5 - numRating)))}
    </span>
  );
};

export default RatingStars;

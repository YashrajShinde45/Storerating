import { useState } from "react";

import Modal from "../common/Modal";

const RatingModal = ({
  store,
  onSubmit,
  onClose,
}) => {
  const [rating, setRating] = useState(
    store.user_rating || 1
  );

  return (
    <Modal
      title={`Rate ${store.name}`}
      onClose={onClose}
    >
      <div className="rating-buttons">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            className={
              rating === value ? "selected-rating" : ""
            }
          >
            {value}
          </button>
        ))}
      </div>

      <button
        className="primary-btn"
        onClick={() => onSubmit(rating)}
      >
        Save Rating
      </button>
    </Modal>
  );
};

export default RatingModal;

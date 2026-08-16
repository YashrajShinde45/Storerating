import RatingStars from "../common/RatingStars";

const StoreCard = ({ store, onRate }) => {
  return (
    <div className="store-card">
      <h3>{store.name}</h3>

      <p>{store.address}</p>

      <p>
        Overall Rating:{" "}
        <strong>{store.overall_rating ?? store.rating}</strong>
      </p>

      <p>
        Your Rating:{" "}
        {store.user_rating ? (
          <RatingStars rating={Number(store.user_rating)} />
        ) : (
          "Not Rated"
        )}
      </p>

      <button
        className="primary-btn"
        onClick={() => onRate(store)}
      >
        {store.user_rating ? "Update Rating" : "Rate Store"}
      </button>
    </div>
  );
};

export default StoreCard;

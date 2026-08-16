import Modal from "../common/Modal";
import RatingStars from "../common/RatingStars";

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  const isOwner = user.role === "owner";

  return (
    <Modal title="User Details" onClose={onClose}>
      <div className="user-details-card">
        <div className="detail-row">
          <strong>Full Name:</strong>
          <span>{user.name}</span>
        </div>

        <div className="detail-row">
          <strong>Email Address:</strong>
          <span>{user.email}</span>
        </div>

        <div className="detail-row">
          <strong>Address:</strong>
          <span>{user.address || "N/A"}</span>
        </div>

        <div className="detail-row">
          <strong>Role:</strong>
          <span className={`role-badge role-${user.role}`}>{user.role}</span>
        </div>

        {isOwner && (
          <div className="detail-row">
            <strong>Store Rating:</strong>
            <span>
              {user.rating ? (
                <>
                  <RatingStars rating={Math.round(user.rating)} /> ({user.rating})
                </>
              ) : (
                "No rating available"
              )}
            </span>
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: "20px" }}>
          <button type="button" className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;

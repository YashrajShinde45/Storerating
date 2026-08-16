import { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../../context/AuthContext";

const ChangePasswordModal = ({ onClose }) => {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

    if (!passwordPattern.test(password)) {
      setError(
        "Password must be 8-16 characters long and include at least one uppercase letter and one special character."
      );
      return;
    }

    setLoading(true);

    try {
      const endpointMap = {
        admin: "http://localhost:5000/api/admin/password",
        user: "http://localhost:5000/api/user/password",
        owner: "http://localhost:5000/api/owner/password",
      };

      const url = endpointMap[user?.role] || endpointMap.user;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setSuccess("Password updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Change Password" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <label>
          New Password
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <p className="hint-text">
          8-16 characters, 1 uppercase letter, 1 special character
        </p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;

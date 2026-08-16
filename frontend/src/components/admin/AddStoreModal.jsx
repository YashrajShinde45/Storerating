import { useState } from "react";
import Modal from "../common/Modal";

const AddStoreModal = ({ owners = [], onSubmit, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: owners.length ? owners[0].id : "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Store name is required.");
      return;
    }

    if (!form.owner_id) {
      setError("Please select a store owner.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...form,
        owner_id: Number(form.owner_id),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add New Store" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <label>
          Store Name
          <input
            name="name"
            placeholder="Store Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Store Email
          <input
            type="email"
            name="email"
            placeholder="Store Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Store Address
          <textarea
            name="address"
            placeholder="Store Address (Max 400 characters)"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Store Owner
          <select
            name="owner_id"
            value={form.owner_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Store Owner --</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Store"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStoreModal;

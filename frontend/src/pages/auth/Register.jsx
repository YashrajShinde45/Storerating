import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 20 || form.name.trim().length > 60) {
      setError("Name must be between 20 and 60 characters.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError("Invalid email format.");
      return;
    }

    if (form.address.length > 400) {
      setError("Address cannot exceed 400 characters.");
      return;
    }

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!passwordPattern.test(form.password)) {
      setError(
        "Password must be 8-16 characters with at least one uppercase letter and one special character."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(form);

      login(response.data.token, response.data.user);

      navigate("/user");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="name"
            placeholder="Full Name (20-60 characters)"
            value={form.name}
            onChange={handleChange}
            required
          />
          <p className="hint-text">Must be 20 to 60 characters long.</p>
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <textarea
            name="address"
            placeholder="Address (Max 400 characters)"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <p className="hint-text">
            8-16 chars, 1 uppercase letter, 1 special char.
          </p>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;

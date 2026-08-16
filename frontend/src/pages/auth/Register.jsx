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

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const response = await registerUser(form);

      login(response.data.token, response.data.user);

      navigate("/user");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
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

  const executeLogin = async (credentials) => {
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(credentials);
      login(response.data.token, response.data.user);

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else if (response.data.user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    executeLogin(form);
  };

  const handleQuickLogin = (email, password) => {
    const creds = { email, password };
    setForm(creds);
    executeLogin(creds);
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>

      <div className="demo-login-box">
        <p className="demo-title">Quick Demo Logins</p>
        <div className="demo-buttons">
          <button
            type="button"
            className="secondary-btn btn-sm"
            onClick={() => handleQuickLogin("admin@platform.com", "Password123!")}
          >
            Admin
          </button>
          <button
            type="button"
            className="secondary-btn btn-sm"
            onClick={() => handleQuickLogin("user@platform.com", "Password123!")}
          >
            User
          </button>
          <button
            type="button"
            className="secondary-btn btn-sm"
            onClick={() => handleQuickLogin("owner@store.com", "Password123!")}
          >
            Store Owner
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
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

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;

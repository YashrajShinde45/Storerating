import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const TEST_ACCOUNTS = [
  {
    role: "Admin",
    email: "admin@example.com",
    password: "Password123!",
  },
  {
    role: "Normal User",
    email: "user@example.com",
    password: "Password123!",
  },
  {
    role: "Store Owner",
    email: "owner@example.com",
    password: "Password123!",
  },
  {
    role: "Yashraj (User)",
    email: "yashrajshinde9022@gmail.com",
    password: "Password123!",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    if (error) setError("");
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
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in both email and password.");
      return;
    }
    executeLogin(form);
  };

  const handleAutofill = (email, password) => {
    setForm({ email, password });
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Sign In</h1>
        <p className="auth-subtitle">Welcome back! Sign in to your account</p>
      </div>

      <div className="demo-login-box">
        <p className="demo-title">Database Test Accounts (Click to Fill)</p>
        <div className="demo-buttons">
          {TEST_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              type="button"
              className="secondary-btn btn-sm"
              onClick={() => handleAutofill(acc.email, acc.password)}
              title={`Autofill ${acc.email}`}
            >
              {acc.role}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="login-email" className="input-label">Email Address</label>
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="e.g. user@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="login-password" className="input-label">Password</label>
          <div className="password-input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        <button type="submit" className="primary-btn submit-btn" disabled={loading}>
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

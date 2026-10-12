import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  {
    id: "user",
    title: "Normal User",
    icon: "👤",
    desc: "Rate stores & submit reviews",
  },
  {
    id: "owner",
    title: "Store Owner",
    icon: "🏪",
    desc: "Manage stores & track ratings",
  },
  {
    id: "admin",
    title: "Admin",
    icon: "🛡️",
    desc: "Manage platform users & stores",
  },
];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    if (error) setError("");
  };

  const handleRoleSelect = (roleId) => {
    setForm((prev) => ({
      ...prev,
      role: roleId,
    }));
    if (error) setError("");
  };

  const nameLength = form.name.trim().length;
  const addressLength = form.address.trim().length;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMsg("");

    const trimmedName = form.name.trim();
    if (trimmedName.length < 20 || trimmedName.length > 60) {
      setError(
        `Name must be between 20 and 60 characters. Current length: ${trimmedName.length} characters.`
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a valid email address (e.g. user@example.com).");
      return;
    }

    const trimmedAddress = form.address.trim();
    if (!trimmedAddress) {
      setError("Address is required.");
      return;
    }

    if (trimmedAddress.length > 400) {
      setError(
        `Address cannot exceed 400 characters. Current length: ${trimmedAddress.length}.`
      );
      return;
    }

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!passwordPattern.test(form.password)) {
      setError(
        "Password must be 8-16 characters and contain at least one uppercase letter and one special character."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please re-type your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name: trimmedName,
        email: form.email.trim(),
        address: trimmedAddress,
        password: form.password,
        role: form.role,
      });

      const registeredRole = response.data.user.role;
      setSuccessMsg(`Account created as ${registeredRole.toUpperCase()}! Redirecting...`);

      // Authenticate with real token and user data from PostgreSQL
      login(response.data.token, response.data.user);

      setTimeout(() => {
        if (registeredRole === "admin") {
          navigate("/admin");
        } else if (registeredRole === "owner") {
          navigate("/owner");
        } else {
          navigate("/user");
        }
      }, 800);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Select your role and create your account</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Role Selection */}
        <div className="role-select-section">
          <label className="input-label">Select Account Role</label>
          <div className="role-cards-grid">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`role-card-btn ${form.role === r.id ? "active" : ""}`}
                onClick={() => handleRoleSelect(r.id)}
              >
                <span className="role-card-icon">{r.icon}</span>
                <span className="role-card-title">{r.title}</span>
                <span className="role-card-desc">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="field-header">
            <label htmlFor="reg-name" className="input-label">Full Name</label>
            <span
              className={`char-counter ${
                nameLength >= 20 && nameLength <= 60
                  ? "counter-valid"
                  : "counter-pending"
              }`}
            >
              {nameLength}/60 chars (min 20)
            </span>
          </div>
          <input
            id="reg-name"
            name="name"
            placeholder="e.g. Johnathan Alexander Smith"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
          <p className="hint-text">Must be 20 to 60 characters long.</p>
        </div>

        <div>
          <label htmlFor="reg-email" className="input-label">Email Address</label>
          <input
            id="reg-email"
            type="email"
            name="email"
            placeholder="e.g. customer@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <div className="field-header">
            <label htmlFor="reg-address" className="input-label">Address</label>
            <span
              className={`char-counter ${
                addressLength <= 400 ? "counter-valid" : "counter-invalid"
              }`}
            >
              {addressLength}/400 chars
            </span>
          </div>
          <textarea
            id="reg-address"
            name="address"
            placeholder="Enter your complete residential address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            required
          />
          <p className="hint-text">Maximum 400 characters.</p>
        </div>

        <div>
          <label htmlFor="reg-password" className="input-label">Password</label>
          <div className="password-input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
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
          <p className="hint-text">
            8-16 characters, 1 uppercase letter, 1 special character.
          </p>
        </div>

        <div>
          <label htmlFor="reg-confirm" className="input-label">Confirm Password</label>
          <input
            id="reg-confirm"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="hint-text counter-invalid">Passwords do not match</p>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        {successMsg && (
          <div className="success-banner">
            <span>✅ {successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="primary-btn submit-btn"
          disabled={loading}
        >
          {loading ? "Registering Account..." : `Register as ${form.role.toUpperCase()}`}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

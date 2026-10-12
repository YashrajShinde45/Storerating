import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../../services/authService";
import Loading from "../../components/common/Loading";

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, login, logout } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Edit Profile Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      const userData = res.data.user;
      setProfileData(userData);
      setStats(res.data.stats || {});
      setName(userData.name || "");
      setAddress(userData.address || "");
    } catch {
      // Fallback to authUser context if API fails
      if (authUser) {
        setProfileData(authUser);
        setName(authUser.name || "");
        setAddress(authUser.address || "");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    const trimmedName = name.trim();
    if (trimmedName.length < 20 || trimmedName.length > 60) {
      setProfileError(
        `Name must be between 20 and 60 characters. (Current: ${trimmedName.length})`
      );
      return;
    }

    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      setProfileError("Address is required.");
      return;
    }
    if (trimmedAddress.length > 400) {
      setProfileError("Address cannot exceed 400 characters.");
      return;
    }

    setProfileSaving(true);
    try {
      const res = await updateProfile({
        name: trimmedName,
        address: trimmedAddress,
      });

      const updatedUser = res.data;
      setProfileData(updatedUser);
      setIsEditing(false);
      setProfileSuccess("Profile updated successfully!");

      // Update AuthContext and localStorage
      const token = localStorage.getItem("token");
      login(token, updatedUser);

      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Password Validation Helpers
  const isLengthValid = newPassword.length >= 8 && newPassword.length <= 16;
  const isUppercaseValid = /[A-Z]/.test(newPassword);
  const isSpecialValid = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;

  const validCount = [isLengthValid, isUppercaseValid, isSpecialValid].filter(Boolean).length;
  const strengthPercentage = (validCount / 3) * 100;
  const strengthLabel =
    newPassword.length === 0
      ? ""
      : validCount === 3
      ? "Strong"
      : validCount === 2
      ? "Moderate"
      : "Weak";

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!isLengthValid || !isUppercaseValid || !isSpecialValid) {
      setPasswordError(
        "Please meet all password requirements before updating."
      );
      return;
    }

    if (!isMatchValid) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordUpdating(true);
    try {
      await changePassword({
        password: newPassword,
        currentPassword: currentPassword || undefined,
      });

      setPasswordSuccess("Your password was successfully updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 5000);
    } catch (err) {
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setPasswordUpdating(false);
    }
  };

  if (loading) return <Loading />;

  const user = profileData || authUser || {};
  const initials = (user.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const formattedJoinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Active Member";

  return (
    <div className="profile-page-container">
      {/* Profile Header Hero Card */}
      <div className="profile-hero-card">
        <div className="profile-avatar-circle">
          <span>{initials}</span>
        </div>
        <div className="profile-hero-info">
          <div className="profile-title-row">
            <h1>{user.name}</h1>
            <span className={`role-badge role-${user.role}`}>
              {user.role === "admin"
                ? "ADMINISTRATOR"
                : user.role === "owner"
                ? "STORE OWNER"
                : "CUSTOMER / USER"}
            </span>
          </div>
          <p className="profile-hero-email">✉️ {user.email}</p>
          <p className="profile-hero-date">📅 Member since: {formattedJoinDate}</p>
        </div>

        <div className="profile-hero-actions">
          <button
            type="button"
            className="hero-logout-btn"
            onClick={handleLogout}
            title="Log out of your account"
          >
            🚪 Log Out
          </button>
        </div>
      </div>

      {/* Role-Specific Stats Overview */}
      <div className="profile-stats-section">
        <h3>Role Overview & Activity</h3>
        <div className="profile-stats-grid">
          {user.role === "admin" && (
            <>
              <div className="profile-stat-box">
                <span className="stat-label">Platform Users</span>
                <span className="stat-value">{stats.total_users ?? 0}</span>
                <span className="stat-desc">Registered accounts</span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Stores Listed</span>
                <span className="stat-value">{stats.total_stores ?? 0}</span>
                <span className="stat-desc">Active store profiles</span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Total Ratings</span>
                <span className="stat-value">{stats.total_ratings ?? 0}</span>
                <span className="stat-desc">Submitted community reviews</span>
              </div>
            </>
          )}

          {user.role === "owner" && (
            <>
              <div className="profile-stat-box">
                <span className="stat-label">Stores Owned</span>
                <span className="stat-value">{stats.stores_count ?? 0}</span>
                <span className="stat-desc">Registered under your account</span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Customer Reviews</span>
                <span className="stat-value">{stats.ratings_received ?? 0}</span>
                <span className="stat-desc">Total ratings received</span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Average Store Rating</span>
                <span className="stat-value">⭐ {stats.average_store_rating ?? "0"}</span>
                <span className="stat-desc">Overall customer satisfaction</span>
              </div>
            </>
          )}

          {user.role === "user" && (
            <>
              <div className="profile-stat-box">
                <span className="stat-label">Stores Rated</span>
                <span className="stat-value">{stats.ratings_count ?? 0}</span>
                <span className="stat-desc">Stores you have reviewed</span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Your Average Rating Given</span>
                <span className="stat-value">
                  ⭐ {stats.average_rating_given ?? "0"}
                </span>
                <span className="stat-desc">Average score you submitted</span>
              </div>
              <div className="profile-stat-box">
                <span className="stat-label">Account Status</span>
                <span className="stat-value" style={{ color: "#16a34a" }}>
                  Active
                </span>
                <span className="stat-desc">Verified community member</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="profile-content-grid">
        {/* Profile Information & Edit Form */}
        <div className="profile-card">
          <div className="card-header-row">
            <div>
              <h2>Personal Information</h2>
              <p className="card-subtitle">Manage your account identity details</p>
            </div>
            {!isEditing ? (
              <button
                type="button"
                className="secondary-btn btn-sm"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="secondary-btn btn-sm"
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name || "");
                  setAddress(user.address || "");
                  setProfileError("");
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {profileError && (
            <div className="error-banner" style={{ marginBottom: "16px" }}>
              <span>⚠️ {profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className="success-banner" style={{ marginBottom: "16px" }}>
              <span>✅ {profileSuccess}</span>
            </div>
          )}

          {!isEditing ? (
            <div className="profile-info-display">
              <div className="info-field">
                <span className="field-label">Full Name</span>
                <span className="field-value">{user.name}</span>
              </div>

              <div className="info-field">
                <span className="field-label">Email Address</span>
                <span className="field-value">{user.email}</span>
              </div>

              <div className="info-field">
                <span className="field-label">Role</span>
                <span className="field-value" style={{ textTransform: "capitalize" }}>
                  {user.role}
                </span>
              </div>

              <div className="info-field">
                <span className="field-label">Residential Address</span>
                <span className="field-value">{user.address || "No address provided"}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-edit-form">
              <div>
                <div className="field-header">
                  <label htmlFor="prof-name" className="input-label">Full Name</label>
                  <span
                    className={`char-counter ${
                      name.trim().length >= 20 && name.trim().length <= 60
                        ? "counter-valid"
                        : "counter-pending"
                    }`}
                  >
                    {name.trim().length}/60 chars (min 20)
                  </span>
                </div>
                <input
                  id="prof-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name (20-60 characters)"
                  required
                />
              </div>

              <div>
                <label className="input-label">Email Address (Read-only)</label>
                <input value={user.email} disabled className="input-disabled" />
              </div>

              <div>
                <div className="field-header">
                  <label htmlFor="prof-address" className="input-label">Address</label>
                  <span
                    className={`char-counter ${
                      address.trim().length <= 400
                        ? "counter-valid"
                        : "counter-invalid"
                    }`}
                  >
                    {address.trim().length}/400 chars
                  </span>
                </div>
                <textarea
                  id="prof-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Residential address"
                  rows={3}
                  required
                />
              </div>

              <div className="form-action-buttons">
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={profileSaving}
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Refined Security & Password Container */}
        <div className="profile-card security-card">
          <div className="security-card-header">
            <div className="security-badge-icon">🛡️</div>
            <div>
              <div className="security-title-row">
                <h2>Security & Password</h2>
                <span className="security-pill">Bcrypt Encrypted</span>
              </div>
              <p className="card-subtitle">
                Ensure your account is protected with a strong, compliant password.
              </p>
            </div>
          </div>

          {passwordError && (
            <div className="error-banner" style={{ marginBottom: "16px" }}>
              <span>⚠️ {passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="success-banner" style={{ marginBottom: "16px" }}>
              <span>✅ {passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="security-password-form">
            <div className="form-group">
              <label htmlFor="current-pass" className="input-label">
                Current Password <span className="label-optional">(Optional)</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  id="current-pass"
                  type={showCurrentPass ? "text" : "password"}
                  placeholder="Enter current password if known"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  tabIndex={-1}
                >
                  {showCurrentPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-pass" className="input-label">
                New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="new-pass"
                  type={showNewPass ? "text" : "password"}
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNewPass(!showNewPass)}
                  tabIndex={-1}
                >
                  {showNewPass ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword.length > 0 && (
                <div className="password-strength-container">
                  <div className="strength-bar-track">
                    <div
                      className={`strength-bar-fill strength-${validCount}`}
                      style={{ width: `${strengthPercentage}%` }}
                    />
                  </div>
                  <span className={`strength-text strength-text-${validCount}`}>
                    Strength: {strengthLabel}
                  </span>
                </div>
              )}

              {/* Real-time Checklist */}
              <div className="password-criteria-checklist">
                <div className={`checklist-item ${isLengthValid ? "item-valid" : ""}`}>
                  <span className="check-icon">{isLengthValid ? "✓" : "○"}</span>
                  <span>8 to 16 characters in length</span>
                </div>
                <div className={`checklist-item ${isUppercaseValid ? "item-valid" : ""}`}>
                  <span className="check-icon">{isUppercaseValid ? "✓" : "○"}</span>
                  <span>At least 1 uppercase letter (A-Z)</span>
                </div>
                <div className={`checklist-item ${isSpecialValid ? "item-valid" : ""}`}>
                  <span className="check-icon">{isSpecialValid ? "✓" : "○"}</span>
                  <span>At least 1 special symbol (!@#$%^&*...)</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-pass" className="input-label">
                Confirm New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirm-pass"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  tabIndex={-1}
                >
                  {showConfirmPass ? "Hide" : "Show"}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div className="match-indicator">
                  {isMatchValid ? (
                    <span className="match-valid">✓ Passwords match</span>
                  ) : (
                    <span className="match-invalid">✕ Passwords do not match yet</span>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="primary-btn security-submit-btn"
              disabled={passwordUpdating || (newPassword.length > 0 && (!isLengthValid || !isUppercaseValid || !isSpecialValid || !isMatchValid))}
            >
              {passwordUpdating ? (
                "Updating Security Credentials..."
              ) : (
                <>🔒 Update Password</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

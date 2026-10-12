import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "owner") return "/owner";
    return "/user";
  };

  const isProfileActive = location.pathname === "/profile";
  const userInitial = (user?.name || "U").trim()[0]?.toUpperCase() || "U";

  return (
    <div>
      <header className="header">
        <div className="header-left">
          <Link to={getDashboardPath()} className="header-logo-link">
            <h2>Store Rating Platform</h2>
          </Link>
          <span className={`role-badge role-${user?.role}`}>
            {user?.role?.toUpperCase()}
          </span>
          <nav className="header-nav">
            <Link
              to={getDashboardPath()}
              className={`nav-link ${!isProfileActive ? "active" : ""}`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="header-right">
          <Link
            to="/profile"
            className={`profile-nav-link ${isProfileActive ? "active" : ""}`}
            title="View Profile and Settings"
          >
            <span className="profile-nav-avatar">{userInitial}</span>
            <span className="profile-nav-name">{user?.name?.split(" ")[0] || "Profile"}</span>
            <span className="profile-nav-badge">My Profile</span>
          </Link>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

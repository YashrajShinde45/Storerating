import { useState } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/common/LogoutButton";
import ChangePasswordModal from "../components/common/ChangePasswordModal";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div>
      <header className="header">
        <div>
          <h2>Store Rating Platform</h2>
          <span className={`role-badge role-${user?.role}`}>
            {user?.role?.toUpperCase()}
          </span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="secondary-btn btn-sm"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
          <LogoutButton />
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default DashboardLayout;

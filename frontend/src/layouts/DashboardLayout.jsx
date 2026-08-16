import { Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/common/LogoutButton";

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div>
      <header className="header">
        <div>
          <h2>Store Rating Platform</h2>
          <p>{user?.role?.toUpperCase()}</p>
        </div>

        <LogoutButton />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

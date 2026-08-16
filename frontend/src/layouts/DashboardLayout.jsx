import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div>
      <header>
        <h2>Store Rating Platform</h2>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

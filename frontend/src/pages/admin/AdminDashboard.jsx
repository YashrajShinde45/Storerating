import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user?.name}</p>
    </>
  );
};

export default AdminDashboard;

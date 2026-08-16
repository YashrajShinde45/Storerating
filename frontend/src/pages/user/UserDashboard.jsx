import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <h1>User Dashboard</h1>
      <p>Welcome {user?.name}</p>
    </>
  );
};

export default UserDashboard;

import { useAuth } from "../../context/AuthContext";

const OwnerDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <h1>Store Owner Dashboard</h1>
      <p>Welcome {user?.name}</p>
    </>
  );
};

export default OwnerDashboard;

const API = "http://localhost:5000/api/owner";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getOwnerDashboard = async () => {
  const response = await fetch(
    `${API}/dashboard`,
    {
      headers: headers(),
    }
  );

  return response.json();
};

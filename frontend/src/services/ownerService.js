const API = "http://localhost:5000/api/owner";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getOwnerDashboard = async () => {
  const response = await fetch(`${API}/dashboard`, {
    headers: headers(),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch owner dashboard data");
  }
  return data;
};

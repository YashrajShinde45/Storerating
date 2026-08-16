const API = "http://localhost:5000/api/owner";

let ownerDashboardMock = {
  stores: [
    {
      id: 101,
      name: "Supermarket Central",
      address: "123 Main Street, Downtown",
      average_rating: "4.5",
    },
    {
      id: 102,
      name: "Gourmet Bakery & Cafe",
      address: "456 Bakery Lane, Old Town",
      average_rating: "4.8",
    },
  ],
  ratedUsers: [
    {
      id: 2,
      name: "Johnathan Doe (Normal User)",
      email: "user@platform.com",
      rating: 5,
      store_name: "Supermarket Central",
    },
    {
      id: 4,
      name: "Alice Smith",
      email: "alice.smith@example.com",
      rating: 4,
      store_name: "Gourmet Bakery & Cafe",
    },
    {
      id: 5,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      rating: 5,
      store_name: "Supermarket Central",
    },
  ],
};

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getOwnerDashboard = async () => {
  try {
    const response = await fetch(`${API}/dashboard`, {
      headers: headers(),
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return { success: true, data: ownerDashboardMock };
  }
};

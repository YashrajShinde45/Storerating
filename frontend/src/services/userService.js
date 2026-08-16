const API = "http://localhost:5000/api/user";

let userStoresMock = [
  {
    id: 101,
    name: "Supermarket Central",
    address: "123 Main Street, Downtown",
    email: "central@supermarket.com",
    overall_rating: 4.5,
    user_rating: 5,
  },
  {
    id: 102,
    name: "Gourmet Bakery & Cafe",
    address: "456 Bakery Lane, Old Town",
    email: "contact@gourmetbakery.com",
    overall_rating: 4.8,
    user_rating: null,
  },
  {
    id: 103,
    name: "Tech Electronics Hub",
    address: "789 Tech Boulevard, Innovation Park",
    email: "sales@techelectronics.com",
    overall_rating: 4.2,
    user_rating: 4,
  },
];

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getStores = async (search = "") => {
  try {
    const response = await fetch(`${API}/stores?search=${search}`, {
      headers: headers(),
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    const filtered = userStoresMock.filter(
      (s) =>
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
    );
    return { success: true, data: filtered };
  }
};

export const submitRating = async (id, rating) => {
  try {
    const response = await fetch(`${API}/stores/${id}/rate`, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to submit rating");
    return data;
  } catch (error) {
    if (error.message && !error.message.includes("fetch")) throw error;

    const store = userStoresMock.find((s) => s.id === Number(id));
    if (store) {
      store.user_rating = Number(rating);
    }
    return { success: true, message: "Rating submitted", data: { rating } };
  }
};

export const updateRating = async (id, rating) => {
  try {
    const response = await fetch(`${API}/stores/${id}/rate`, {
      method: "PUT",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update rating");
    return data;
  } catch (error) {
    if (error.message && !error.message.includes("fetch")) throw error;

    const store = userStoresMock.find((s) => s.id === Number(id));
    if (store) {
      store.user_rating = Number(rating);
    }
    return { success: true, message: "Rating updated", data: { rating } };
  }
};

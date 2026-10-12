const API = "http://localhost:5000/api/user";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getStores = async (search = "") => {
  try {
    const response = await fetch(`${API}/stores?search=${encodeURIComponent(search)}`, {
      headers: headers(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to load stores");
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Unable to connect to the backend server.");
    }
    throw error;
  }
};

export const submitRating = async (id, rating) => {
  const response = await fetch(`${API}/stores/${id}/rate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ rating: Number(rating) }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to submit rating");
  }

  return data;
};

export const updateRating = async (id, rating) => {
  const response = await fetch(`${API}/stores/${id}/rate`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ rating: Number(rating) }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update rating");
  }

  return data;
};

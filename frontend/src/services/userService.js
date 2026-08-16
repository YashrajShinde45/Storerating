const API = "http://localhost:5000/api/user";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getStores = async (search = "") => {
  const response = await fetch(
    `${API}/stores?search=${search}`,
    {
      headers: headers(),
    }
  );

  return response.json();
};

export const submitRating = async (id, rating) => {
  const response = await fetch(
    `${API}/stores/${id}/rate`,
    {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    }
  );

  return response.json();
};

export const updateRating = async (id, rating) => {
  const response = await fetch(
    `${API}/stores/${id}/rate`,
    {
      method: "PUT",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    }
  );

  return response.json();
};

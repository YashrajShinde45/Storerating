const API = "http://localhost:5000/api/admin";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getDashboard = async () => {
  const response = await fetch(`${API}/dashboard`, {
    headers: headers(),
  });
  return response.json();
};

export const getUsers = async (
  search = "",
  role = "",
  sort = "name",
  order = "ASC"
) => {
  const response = await fetch(
    `${API}/users?search=${search}&role=${role}&sort=${sort}&order=${order}`,
    {
      headers: headers(),
    }
  );

  return response.json();
};

export const getUserDetails = async (id) => {
  const response = await fetch(`${API}/users/${id}`, {
    headers: headers(),
  });
  return response.json();
};

export const addUser = async (userData) => {
  const response = await fetch(`${API}/users`, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create user");
  }
  return data;
};

export const getStores = async (
  search = "",
  sort = "name",
  order = "ASC"
) => {
  const response = await fetch(
    `${API}/stores?search=${search}&sort=${sort}&order=${order}`,
    {
      headers: headers(),
    }
  );

  return response.json();
};

export const addStore = async (storeData) => {
  const response = await fetch(`${API}/stores`, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storeData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create store");
  }
  return data;
};

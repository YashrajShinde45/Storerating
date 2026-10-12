const API = "http://localhost:5000/api/admin";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getDashboard = async () => {
  const response = await fetch(`${API}/dashboard`, {
    headers: headers(),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch dashboard stats");
  }
  return data;
};

export const getUsers = async (
  search = "",
  role = "",
  sort = "name",
  order = "ASC"
) => {
  const query = new URLSearchParams({
    search: search || "",
    role: role || "",
    sort: sort || "name",
    order: order || "ASC",
  }).toString();

  const response = await fetch(`${API}/users?${query}`, {
    headers: headers(),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch users");
  }
  return data;
};

export const getUserDetails = async (id) => {
  const response = await fetch(`${API}/users/${id}`, {
    headers: headers(),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch user details");
  }
  return data;
};

export const addUser = async (userData) => {
  const response = await fetch(`${API}/users`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(userData),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg =
      data && Array.isArray(data.data) && data.data.length
        ? data.data.join(". ")
        : data?.message || "Failed to create user";
    throw new Error(errorMsg);
  }
  return data;
};

export const getStores = async (
  search = "",
  sort = "name",
  order = "ASC"
) => {
  const query = new URLSearchParams({
    search: search || "",
    sort: sort || "name",
    order: order || "ASC",
  }).toString();

  const response = await fetch(`${API}/stores?${query}`, {
    headers: headers(),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch stores");
  }
  return data;
};

export const addStore = async (storeData) => {
  const response = await fetch(`${API}/stores`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(storeData),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg =
      data && Array.isArray(data.data) && data.data.length
        ? data.data.join(". ")
        : data?.message || "Failed to create store";
    throw new Error(errorMsg);
  }
  return data;
};

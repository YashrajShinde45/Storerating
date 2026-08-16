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

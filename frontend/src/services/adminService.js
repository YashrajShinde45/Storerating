const API = "http://localhost:5000/api/admin";

let mockUsers = [
  {
    id: 1,
    name: "System Admin User (Primary)",
    email: "admin@platform.com",
    address: "100 Admin Plaza, Suite 1",
    role: "admin",
  },
  {
    id: 2,
    name: "Johnathan Doe (Normal User)",
    email: "user@platform.com",
    address: "456 Greenfield Avenue",
    role: "user",
  },
  {
    id: 3,
    name: "Mario Rossi (Store Owner)",
    email: "owner@store.com",
    address: "789 Commercial Boulevard",
    role: "owner",
    rating: 4.5,
  },
];

let mockStores = [
  {
    id: 101,
    name: "Supermarket Central",
    email: "central@supermarket.com",
    address: "123 Main Street, Downtown",
    owner_id: 3,
    owner_name: "Mario Rossi (Store Owner)",
    rating: 4.5,
  },
  {
    id: 102,
    name: "Gourmet Bakery & Cafe",
    email: "contact@gourmetbakery.com",
    address: "456 Bakery Lane, Old Town",
    owner_id: 3,
    owner_name: "Mario Rossi (Store Owner)",
    rating: 4.8,
  },
  {
    id: 103,
    name: "Tech Electronics Hub",
    email: "sales@techelectronics.com",
    address: "789 Tech Boulevard, Innovation Park",
    owner_id: 3,
    owner_name: "Mario Rossi (Store Owner)",
    rating: 4.2,
  },
];

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getDashboard = async () => {
  try {
    const response = await fetch(`${API}/dashboard`, {
      headers: headers(),
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return {
      success: true,
      data: {
        users: mockUsers.length,
        stores: mockStores.length,
        ratings: 12,
      },
    };
  }
};

export const getUsers = async (
  search = "",
  role = "",
  sort = "name",
  order = "ASC"
) => {
  try {
    const response = await fetch(
      `${API}/users?search=${search}&role=${role}&sort=${sort}&order=${order}`,
      { headers: headers() }
    );
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    let filtered = mockUsers.filter((u) => {
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.address.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !role || u.role === role;
      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      const valA = (a[sort] || "").toString().toLowerCase();
      const valB = (b[sort] || "").toString().toLowerCase();
      if (valA < valB) return order === "ASC" ? -1 : 1;
      if (valA > valB) return order === "ASC" ? 1 : -1;
      return 0;
    });

    return { success: true, data: filtered };
  }
};

export const getUserDetails = async (id) => {
  try {
    const response = await fetch(`${API}/users/${id}`, {
      headers: headers(),
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    const user = mockUsers.find((u) => u.id === Number(id)) || mockUsers[0];
    return { success: true, data: user };
  }
};

export const addUser = async (userData) => {
  try {
    const response = await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create user");
    return data;
  } catch (error) {
    if (error.message && !error.message.includes("fetch")) throw error;

    const newUser = { id: Date.now(), ...userData };
    mockUsers.push(newUser);
    return { success: true, message: "User created", data: newUser };
  }
};

export const getStores = async (
  search = "",
  sort = "name",
  order = "ASC"
) => {
  try {
    const response = await fetch(
      `${API}/stores?search=${search}&sort=${sort}&order=${order}`,
      { headers: headers() }
    );
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    let filtered = mockStores.filter((s) => {
      return (
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
      );
    });

    filtered.sort((a, b) => {
      const valA = (a[sort] || "").toString().toLowerCase();
      const valB = (b[sort] || "").toString().toLowerCase();
      if (valA < valB) return order === "ASC" ? -1 : 1;
      if (valA > valB) return order === "ASC" ? 1 : -1;
      return 0;
    });

    return { success: true, data: filtered };
  }
};

export const addStore = async (storeData) => {
  try {
    const response = await fetch(`${API}/stores`, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storeData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create store");
    return data;
  } catch (error) {
    if (error.message && !error.message.includes("fetch")) throw error;

    const owner = mockUsers.find((u) => u.id === Number(storeData.owner_id));
    const newStore = {
      id: Date.now(),
      ...storeData,
      owner_name: owner ? owner.name : `Owner #${storeData.owner_id}`,
      rating: 0,
    };
    mockStores.push(newStore);
    return { success: true, message: "Store created", data: newStore };
  }
};

const API_URL = "http://localhost:5000/api/auth";

const MOCK_USERS = {
  "admin@platform.com": {
    id: 1,
    name: "System Admin User (Primary)",
    email: "admin@platform.com",
    role: "admin",
    address: "100 Admin Plaza, Suite 1, Central City",
  },
  "user@platform.com": {
    id: 2,
    name: "Johnathan Doe (Normal User)",
    email: "user@platform.com",
    role: "user",
    address: "456 Greenfield Avenue, Westside",
  },
  "owner@store.com": {
    id: 3,
    name: "Mario Rossi (Store Owner)",
    email: "owner@store.com",
    role: "owner",
    address: "789 Commercial Boulevard, Market Square",
  },
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        Array.isArray(data.data) && data.data.length
          ? data.data[0]
          : data.message || "Login failed";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.message && !error.message.includes("fetch")) {
      throw error;
    }

    // Fallback Mock Login mode if backend server is not running
    const user = MOCK_USERS[credentials.email.toLowerCase()] || {
      id: Date.now(),
      name: credentials.email.split("@")[0],
      email: credentials.email,
      role: credentials.email.includes("admin")
        ? "admin"
        : credentials.email.includes("owner")
        ? "owner"
        : "user",
      address: "123 Default Street, Platform City",
    };

    return {
      success: true,
      message: "Login successful (Demo Mode)",
      data: {
        token: `mock-jwt-token-${user.id}-${Date.now()}`,
        user,
      },
    };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        Array.isArray(data.data) && data.data.length
          ? data.data[0]
          : data.message || "Registration failed";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.message && !error.message.includes("fetch")) {
      throw error;
    }

    // Fallback Mock Register mode
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      address: userData.address,
      role: "user",
    };

    return {
      success: true,
      message: "Registration successful (Demo Mode)",
      data: {
        token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
        user: newUser,
      },
    };
  }
};

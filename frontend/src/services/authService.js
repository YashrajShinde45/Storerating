const API_URL = "http://localhost:5000/api/auth";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data && Array.isArray(data.data) && data.data.length
          ? data.data[0]
          : data?.message || "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the backend server. Please verify the backend is running on port 5000."
      );
    }
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        address: userData.address.trim(),
        password: userData.password,
        role: userData.role || "user",
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data && Array.isArray(data.data) && data.data.length
          ? data.data.join(". ")
          : data?.message || "Registration failed. Please check your input.";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to the backend server. Please verify the backend is running on port 5000."
      );
    }
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || "Failed to load profile");
    }
    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Unable to connect to backend server.");
    }
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update profile");
    }
    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Unable to connect to backend server.");
    }
    throw error;
  }
};

export const changePassword = async ({ password, currentPassword }) => {
  try {
    const response = await fetch(`${API_URL}/password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password, currentPassword }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || "Failed to change password");
    }
    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Unable to connect to backend server.");
    }
    throw error;
  }
};

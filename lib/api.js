import AsyncStorage from "@react-native-async-storage/async-storage";

// Registrera användare
export const createUser = async (email, password, username) => {
  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Registrering misslyckades");
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logga in användare
export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Inloggning misslyckades");
    await AsyncStorage.setItem("token", data.token);
    return data.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Hämta nuvarande användare
export const getCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Ingen token hittad");
    const response = await fetch("http://localhost:3000/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Kunde inte hämta användare");
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logga ut
export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
};

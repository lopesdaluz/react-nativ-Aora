import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.0.54:3000";

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
    console.log("Token sparad:", token);
    const savedToken = await AsyncStorage.getItem("token");
    console.log("Verifierad sparad token:", savedToken);
  } catch (error) {
    console.error("Fel vid sparande av token:", error.message);
    throw error;
  }
};

// Registrera användare
export const createUser = async (email, password, username) => {
  try {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });
    console.log("createUser status:", response.status);
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Registrering misslyckades");
    // Spara token
    if (data.token) {
      await storeToken(data.token);
      console.log("Token sparad vid registrering:", data.token);
    }
    console.log("createUser data:", data);
    return data;
  } catch (error) {
    console.error("Fel vid registrering:", error.message);
    throw new Error(error.message);
  }
};

// Logga in användare
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log("loginUser status:", response.status);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Inloggning misslyckades");
    await storeToken(data.token); // Spara token
    console.log("loginUser user:", data.user);
    return data.user;
  } catch (error) {
    console.error("Fel vid inloggning:", error.message);
    throw new Error(error.message);
  }
};

// Hämta nuvarande användare
export const getCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log("Token för getCurrentUser:", token);
    if (!token) throw new Error("Ingen token hittad");
    console.log("Skickar förfrågan till:", `${BASE_URL}/api/user`);
    const response = await fetch(`${BASE_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getCurrentUser status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP-fel: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    console.log("getCurrentUser data:", data);
    return data;
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error.message);
    throw error;
  }
};

// Logga ut
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("token");
    console.log("Token raderad");
  } catch (error) {
    console.error("Logout error:", error.message);
    await AsyncStorage.removeItem("token");
  }
};

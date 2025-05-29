import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../lib/api";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("(auth)");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token vid start:", token);
        if (token) {
          const user = await getCurrentUser();
          console.log("getCurrentUser lyckades, user:", user);
          setInitialRoute("(tabs)");
          console.log("Satt initialRoute till (tabs)");
        } else {
          console.log("Ingen token, sätter initialRoute till (auth)");
          setInitialRoute("(auth)");
        }
      } catch (error) {
        console.log("Root auth check failed:", error.message);
        setInitialRoute("(auth)");
      } finally {
        setIsLoading(false);
        console.log("isLoading satt till false, initialRoute:", initialRoute);
      }
    };

    if (fontsLoaded) {
      console.log("Startar checkAuth, fontsLoaded:", fontsLoaded);
      checkAuth();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
      console.log("SplashScreen gömd, initialRoute:", initialRoute);
    }
  }, [fontsLoaded, error, isLoading]);

  if (!fontsLoaded || isLoading) {
    console.log("Väntar på fonts eller loading, initialRoute:", initialRoute);
    return null;
  }

  console.log("Renderar Stack, initialRouteName:", initialRoute);
  return (
    <Stack initialRouteName={initialRoute}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;

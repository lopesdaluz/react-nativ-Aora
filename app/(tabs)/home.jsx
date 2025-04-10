import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../lib/api";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        console.log("Hämta användare:", currentUser);
        setUser(currentUser);
      } catch (error) {
        console.log("Fel vid hämtning av användare:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 16, flex: 1, justifyContent: "center" }}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFA001" />
          ) : (
            <Text
              style={{
                fontSize: 24,
                color: "#FFFFFF",
                fontFamily: "Psemibold",
              }}
            >
              {user ? `Welcome back, ${user.username}!` : "No user found"}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

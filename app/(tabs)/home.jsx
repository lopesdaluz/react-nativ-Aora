import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../lib/api";

const BASE_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.0.54:3000";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        console.log("Hämta användare:", currentUser);
        setUser(currentUser);

        //Hämta posts från backend
        const response = await fetch(`${BASE_URL}/api/posts`);
        if (!response.ok) throw new Error("kunde inte hämta posts");
        const postData = await response.json();
        setPosts(postData);
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
            <>
              <Text
                style={{
                  fontSize: 24,
                  color: "#FFFFFF",
                  fontFamily: "Psemibold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                {user ? `Welcome back, ${user.username}!` : "No user found"}
              </Text>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Text
                    key={post._id}
                    style={{
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontFamily: "Pregular",
                      marginVertical: 5,
                    }}
                  >
                    {post.title}
                  </Text>
                ))
              ) : (
                <Text style={{ color: "#FFFFF" }}>No post available</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

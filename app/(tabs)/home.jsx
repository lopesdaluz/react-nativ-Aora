import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentUser } from "../../lib/api";

const BASE_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.0.54:3000";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      console.log("Hämtad användare:", currentUser);
      setUser(currentUser);

      const response = await fetch(`${BASE_URL}/api/posts`);
      if (!response.ok) {
        throw new Error(`HTTP-fel: ${response.status} ${response.statusText}`);
      }
      const postData = await response.json();
      console.log("Hämtade posts:", postData);
      setPosts(postData);
    } catch (error) {
      console.log("Fel vid hämtning:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

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
              {error ? (
                <Text style={{ color: "#FF0000" }}>Fel: {error}</Text>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <View
                    key={post._id}
                    style={{
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#bc1111",
                        fontSize: 16,
                        fontFamily: "Pregular",
                      }}
                    >
                      {post.title}
                    </Text>
                    {post.image && (
                      <Image
                        source={{ uri: post.image }}
                        style={{ width: 200, height: 200, marginTop: 5 }}
                      />
                    )}
                  </View>
                ))
              ) : (
                <Text style={{ color: "#FFFFFF" }}>No posts available</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

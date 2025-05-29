import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Platform,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { getCurrentUser, logoutUser } from "../../lib/api";
import { Link, router } from "expo-router";

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
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/sign-in");
    } catch (error) {
      console.log("Logout failed", error.message);
      setError("Logout not successfull");
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#FFA001"
            style={styles.loader}
          />
        ) : (
          <>
            {/* Välkomsttext i egen View */}
            <View style={styles.headerContainer}>
              <Text style={styles.header}>
                {user ? `Welcome back, ${user.username}!` : "No user found"}
              </Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>
            {error ? (
              <Text style={styles.error}>Fel: {error}</Text>
            ) : posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noPosts}>No posts available</Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161622",
    paddingTop: Platform.OS === "ios" ? 0 : 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#161622",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Psemibold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#FFA001",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontFamily: "Pregular",
    fontSize: 16,
  },
  error: {
    color: "#FF0000",
    textAlign: "center",
    marginVertical: 10,
  },
  noPosts: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Pregular",
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    margin: 8,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Psemibold",
    color: "#161622",
    marginBottom: 8,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Home;

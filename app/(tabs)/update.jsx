import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const BASE_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.0.54:3000";

const Update = () => {
  const { post } = useLocalSearchParams();
  console.log("Received post params:", post); // Ny logg
  const parsedPost = post ? JSON.parse(post) : null;
  console.log("Parsed post:", parsedPost); // Ny logg
  const [title, setTitle] = useState(parsedPost?.title || "");
  const [image, setImage] = useState(parsedPost?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (parsedPost && !title && !image) {
      console.log(
        "Setting initial values:",
        parsedPost.title,
        parsedPost.image
      ); // Ändrad logg
      setTitle(parsedPost.title);
      setImage(parsedPost.image);
    }
  }, [parsedPost]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["image"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    console.log("ImagePicker result:", result);
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      if (blob.size > 1000000) {
        setError("Bilden är för stor (max 1 MB)");
        return;
      }
      setImage(uri);
      console.log("Vald bild URI:", uri, "Storlek:", blob.size);
    }
  };

  const resetForm = () => {
    console.log("Resetting form to:", parsedPost?.title, parsedPost?.image);
    setTitle(parsedPost?.title || "");
    setImage(parsedPost?.image || null);
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!title.trim()) throw new Error("Title cannot be empty");
      const token = await AsyncStorage.getItem("token");
      console.log("Raw token:", token);
      console.log("Token length:", token?.length);
      console.log("Token starts with eyJ:", token?.startsWith("eyJ"));
      if (!token) throw new Error("No token found");
      console.log("Updating post:", { title, image });
      const response = await fetch(`${BASE_URL}/api/posts/${parsedPost?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, image }),
      });
      const data = await response.json();
      console.log("Svar från server:", data);
      if (!response.ok)
        throw new Error(data.message || "Failed to update post");
      Alert.alert("Success", "Post updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Update post fel:", error.message);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Update Post</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => {
            console.log("Title changed to:", text);
            setTitle(text);
          }}
          placeholder="Enter post title"
          placeholderTextColor="#888888"
          autoCapitalize="none" // Ny
          autoCorrect={false} // Ny
        />
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.disabledButton]}
          onPress={pickImage}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {error && <Text style={styles.error}>Fel: {error}</Text>}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isSubmitting && styles.disabledButton,
              { flex: 1 },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Updating..." : "Update"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.resetButton, { flex: 1 }]}
            onPress={resetForm}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Psemibold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Pregular",
    color: "#161622",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#FFA001",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#888888",
  },
  resetButton: {
    backgroundColor: "#FF0000",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Pregular",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    color: "#FF0000",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Pregular",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});

export default Update;

import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  Platform,
  Image,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../../lib/api";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const BASE_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.0.54:3000";

const Create = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      if (blob.size > 1000000) {
        setError("bilden är för stor");
      }
      setImage(uri);
      console.log("Vald bild URI:", uri, "Storlek:", blob.size);
      // setImage(result.assets[0].uri);
      // console.log("Vald bild URI:", result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!title.trim()) throw new Error("Title cannot be empty");
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const user = await getCurrentUser();
      console.log("Skickar post:", { title, image, creator: user.id });
      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, image, creator: user.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      setTitle("");
      setImage(null);
      alert("Post created");
      navigation.navigate("home");
    } catch (error) {
      console.error("Skapa post fel:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <View style={{ padding: 60 }}>
        <Text
          style={{
            fontSize: 20,
            color: "#FFFFFF",
            fontFamily: "Psemibold",
            margin: 30,
          }}
        >
          Create a post
        </Text>
        <TextInput
          style={{
            backgroundColor: "#FFFFFF",
            marginVertical: 5,
            color: "#000000",
            fontFamily: "Pregular",
          }}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter post title"
          placeholderTextColor="#888888"
        />
        <Button title="Pick an image" onPress={pickImage} />
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginVertical: 10 }}
          />
        )}
        {error && (
          <Text style={{ color: "#FF0000", marginBottom: 10 }}>{error}</Text>
        )}
        <Button
          title={isSubmitting ? "Submitting...." : "Submit"}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;

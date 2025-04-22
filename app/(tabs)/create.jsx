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

  //Funktion för att välja bild
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri); //spara bildens URI
    }
  };

  //hantera post-anropet
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!title.trim()) throw new Error("Title cannot be empty");
      const token = await AsyncStorage.getItem("token"); //hämtar token för autentisering
      if (!token) throw new Error("No token found");
      const user = await getCurrentUser(); //hämtar den inloggade
      const response = await fetch(`${BASE_URL}/api/posts`, {
        //skickar POST till api/post
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, image, creator: user.id }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create post");
      }

      setTitle(""); //Rensa input
      setImage(null); //Rensa bild
      alert("Post created");
      navigation.navigate("home");
    } catch (error) {
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

        {Image && (
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

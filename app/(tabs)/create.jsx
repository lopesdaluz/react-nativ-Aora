import { View, Text, SafeAreaView, TextInput } from "react-native";
import React, { useState } from "react";

const Create = () => {
  const [title, setTitle] = useState(" ");

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
      </View>
    </SafeAreaView>
  );
};

export default Create;

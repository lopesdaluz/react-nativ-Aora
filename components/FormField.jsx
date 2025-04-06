import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = title === "Password";

  return (
    <View style={[{ marginBottom: 16 }, otherStyles]}>
      <Text
        style={{
          fontSize: 14,
          color: "#E1E1E6",
          fontFamily: "Pmedium",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          width: "100%",
          height: 48,
          backgroundColor: "#1C1C1E",
          borderWidth: 2,
          borderColor: "#000",
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A5A5A5"
          secureTextEntry={isPassword && !showPassword}
          style={{
            flex: 1,
            color: "#E1E1E6",
            fontFamily: "Pmedium",
          }}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyehide}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

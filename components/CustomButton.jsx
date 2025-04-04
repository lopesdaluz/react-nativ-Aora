import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: "#F58C42",
          borderRadius: 12,
          minHeight: 62,
          justifyContent: "center",
          alignItems: "center",
        },
        containerStyles,
        isLoading ? { opacity: 0.5 } : {},
      ]}
      disabled={isLoading}
    >
      <Text
        style={[
          {
            color: "#FFFFFF",
            fontWeight: "600",
            fontSize: 18,
          },
          textStyles,
        ]}
      >
        {title || "CustomButton"}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

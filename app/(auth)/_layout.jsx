import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" option={{ headerShown: false }} />
        <Stack.Screen name="sign-up" option={{ headerShown: false }} />
      </Stack>
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
    </>
  );
};

export default AuthLayout;

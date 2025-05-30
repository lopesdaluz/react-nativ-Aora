import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/api";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    console.log("Submit successfully working:", form);
    setIsSubmitting(true);
    try {
      await createUser(form.email, form.password, form.username);
      Alert.alert("Success", "Account created please sign in");
      router.replace("/sign-in"); //Navigerar till sign in skärmen
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{ width: 115, height: 35 }}
        />

        <Text
          style={{
            fontSize: 24,
            color: "#FFFFFF",
            fontFamily: "Psemibold",
            marginTop: 40,
          }}
        >
          Sign up to Aora
        </Text>
        <FormField
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({ ...form, username: e })}
          otherStyles={{ marginTop: 30 }}
        />
        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles={{ marginTop: 28 }}
          keyboardType="email-address"
        />

        <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({ ...form, password: e })}
          otherStyles={{ marginTop: 28 }}
        />

        <View style={{ marginTop: 28 }}>
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            isLoading={isSubmitting}
          />
          <View
            style={{
              justifyContent: "center",
              paddingTop: 5,
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Text style={{ color: "#D1D1D1", fontFamily: "Pregular" }}>
              Have an account already?{" "}
            </Text>
            <Link
              href="/sign-in"
              style={{
                fontSize: 16,
                fontFamily: "Psemibold",
                color: "#F58C42",
              }}
            >
              Sign In!
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

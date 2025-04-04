import { Text, View, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <Image
            source={images.logo}
            style={{ width: 130, height: 84 }}
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            style={{ width: "100%", height: 380, maxWidth: 380 }}
            resizeMode="contain"
          />
          <View style={{ marginTop: 16, position: "relative" }}>
            <Text
              style={{
                fontSize: 24,
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Discover Endless Possibilities with {""}
              <Text style={{ color: "#FCD34D" }}>Aora</Text>
            </Text>
            <Image
              style={{ width: 136, height: 15, position: "absolute" }}
              source={images.path}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Pregular",
              color: "#E1E1E6",
              marginTop: 28,
              textAlign: "center",
            }}
          >
            Where creativity meets innovation: embark on a journey of limitless
            exploration with Aora
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles={{ width: "100%", marginTop: 28 }}
          />
        </View>
      </ScrollView>
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
    </SafeAreaView>
  );
}

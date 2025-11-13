// app/onboarding.jsx
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, ImageBackground, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, router } from "expo-router";
import CustomButton from "../components/CustomButton";

export default function Onboarding() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* HERO */}
        <ImageBackground
          source={require("../assets/images/bg.png")}
          style={{ width: "100%", height: 280, justifyContent: "center", alignItems: "center" }}
          imageStyle={{ resizeMode: "cover" }}
        >
          <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.30)" }} />
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", textAlign: "center", lineHeight: 34 }}>
            Discover endless{"\n"}possibilities
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.9)", marginTop: 8, textAlign: "center" }}>
            Build, explore, and get productive faster.
          </Text>
        </ImageBackground>

        {/* BODY CARD */}
        <View style={{ paddingHorizontal: 24, marginTop: -24 }}>
          <View style={{
            backgroundColor: "#fff", borderRadius: 16, padding: 20, gap: 8,
            shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 }, elevation: 3
          }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              Welcome to <Text style={{ color: "#000" }}>Marinus</Text>
            </Text>
            <Text style={{ color: "#6B7280" }}>
              Start with your email now or skip and jump right into the app. You can sign in later.
            </Text>

            <CustomButton
              title="Continue with email"
              onPress={() => router.push("/(auth)/sign-in")}
            />

            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Link href="/(tabs)/home" style={{ color: "#2563EB", textDecorationLine: "underline" }}>
                Skip for now → Home
              </Link>
              <Pressable
                onPress={() => router.push("/(auth)/sign-up")}
                style={{
                  height: 44, paddingHorizontal: 16, borderRadius: 12,
                  borderWidth: 1, borderColor: "#E5E7EB", justifyContent: "center", alignItems: "center"
                }}
              >
                <Text style={{ color: "#1F2937", fontWeight: "600" }}>Create account</Text>
              </Pressable>
            </View>
          </View>

          <Text style={{ textAlign: "center", color: "#9CA3AF", fontSize: 12, marginTop: 16, marginBottom: 24 }}>
            By continuing you agree to our Terms & Privacy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

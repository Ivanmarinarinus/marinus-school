import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, Image, Alert } from "react-native";
import { Link, router } from "expo-router";
import CustomTextField from "../../components/CustomTextField";
import CustomButton from "../../components/CustomButton"; // your existing button

export default function SignIn() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Signed in", `Welcome, ${email || "friend"}!`);
      router.replace("/(tabs)/home");
    }, 900);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: "center" }}>
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Image source={require("../../assets/images/bg.png")}
                   style={{ width: 72, height: 72, borderRadius: 16 }} />
          </View>

          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827" }}>Sign in</Text>
          <Text style={{ color: "#6B7280", marginBottom: 4 }}>
            Welcome back! Enter your details to continue.
          </Text>

          <CustomTextField label="Email" placeholder="you@example.com"
                           value={email} onChangeText={setEmail}
                           keyboardType="email-address" />

          <CustomTextField label="Password" placeholder="Your password"
                           value={password} onChangeText={setPassword} secure />

          <CustomButton title={loading ? "Signing in..." : "Sign in"}
                        onPress={handleSubmit} disabled={loading} />

          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Text style={{ color: "#6B7280" }}>Don't have an account?</Text>
            <Link href="/(auth)/sign-up" style={{ color: "#2563EB", fontWeight: "600" }}>Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

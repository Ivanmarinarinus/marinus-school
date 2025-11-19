import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, Alert } from "react-native";
import { Link, router } from "expo-router";
import CustomTextField from "../../components/CustomTextField";
import CustomButton from "../../components/CustomButton";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Account created", `Welcome, ${username || "new user"}!`);
      router.replace("/(auth)/sign-in");
    }, 900);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827" }}>Sign up</Text>
          <Text style={{ color: "#6B7280", marginBottom: 4 }}>Create your account to get started.</Text>

          <CustomTextField label="Username" placeholder="yourname"
                           value={username} onChangeText={setUsername} />
          <CustomTextField label="Email" placeholder="you@example.com"
                           value={email} onChangeText={setEmail}
                           keyboardType="email-address" />
          <CustomTextField label="Password" placeholder="Create a password"
                           value={password} onChangeText={setPassword} secure />

          <CustomButton title={loading ? "Creating..." : "Create account"}
                        onPress={handleSubmit} disabled={loading} />

          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Text style={{ color: "#6B7280" }}>Already have an account?</Text>
            <Link href="/(auth)/sign-in" style={{ color: "#2563EB", fontWeight: "600" }}>Sign in</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

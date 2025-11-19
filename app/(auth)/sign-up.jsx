import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { router, Link } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!username || !email || !password) return alert("Fill all fields");
    setSubmitting(true);
    const { error } = await signUp({ email, password, username });
    setSubmitting(false);
    if (error) return alert(error.message);
    alert("Check your email to confirm the account, then sign in.");
    router.replace("/(auth)/sign-in");
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: "center", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 8 }}>Create account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14 }}
      />
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14 }}
      />

      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        style={{
          backgroundColor: "#111827",
          padding: 16,
          borderRadius: 12,
          marginTop: 6,
          opacity: submitting ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "700", fontSize: 16 }}>
          {submitting ? "Creating…" : "Sign up"}
        </Text>
      </Pressable>

      <Text style={{ textAlign: "center", marginTop: 12 }}>
        Already have an account?{" "}
        <Link href="/(auth)/sign-in" style={{ color: "#2563EB", fontWeight: "700" }}>
          Sign in
        </Link>
      </Text>
    </View>
  );
}

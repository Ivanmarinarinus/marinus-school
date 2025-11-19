import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { router, Link } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

async function handleSubmit() {
  // sanitize
  const e = email.trim().replace(/^"+|"+$/g, "").toLowerCase();
  const p = password; // could also trim if you don't want leading/trailing spaces

  if (!e || !p) return alert("Enter email and password");

  setSubmitting(true);
  const { error } = await signIn(e, p); // or signUp({ email: e, password: p, username })
  setSubmitting(false);
  if (error) return alert(error.message);
  router.replace("/(tabs)/home");
}

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: "center", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 8 }}>Sign in</Text>

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
          {submitting ? "Signing in…" : "Sign in"}
        </Text>
      </Pressable>

      <Text style={{ textAlign: "center", marginTop: 12 }}>
        Don’t have an account?{" "}
        <Link href="/(auth)/sign-up" style={{ color: "#2563EB", fontWeight: "700" }}>
          Sign up
        </Link>
      </Text>
    </View>
  );
}

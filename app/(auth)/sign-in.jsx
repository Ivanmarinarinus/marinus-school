// app/(auth)/sign-in.jsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "../contexts/AuthProvider"; // path is correct because (auth) is inside app/

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    try {
      if (!email || !password) {
        Alert.alert("Missing info", "Please enter email and password.");
        return;
      }
      setSubmitting(true);
      await signIn({ email: email.trim(), password });
      // success → go to tabs/home
      router.replace("/(tabs)/home");
    } catch (err) {
      // Surface common supabase errors (e.g., email_not_confirmed)
      Alert.alert("Sign in failed", err?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 6 }}>Sign in</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: "#e5e7eb", padding: 12, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: "#e5e7eb", padding: 12, borderRadius: 8 }}
      />

      <Pressable
        onPress={onSubmit}
        disabled={submitting}
        style={{
          backgroundColor: submitting ? "#9CA3AF" : "#111827",
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 6,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>
          {submitting ? "Signing in..." : "Sign in"}
        </Text>
      </Pressable>

      <Link href="/(auth)/sign-up" style={{ marginTop: 12 }}>
        <Text style={{ color: "#2563eb" }}>Create an account</Text>
      </Link>
    </View>
  );
}

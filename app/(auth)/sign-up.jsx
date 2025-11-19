// app/(auth)/sign-up.jsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../contexts/AuthProvider";

export default function SignUpScreen() {
  const { user, initializing, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initializing && user) router.replace("/(tabs)/home");
  }, [user, initializing]);

  async function onSubmit() {
    const e = email.trim().replace(/^"+|"+$/g, "").toLowerCase();
    if (!e || !username || !password) return Alert.alert("Missing info", "All fields are required.");
    setSubmitting(true);
    const { error } = await signUp({ email: e, password, username });
    setSubmitting(false);
    if (error) Alert.alert("Sign up failed", error.message);
    else {
      Alert.alert(
        "Check your email",
        "We sent a confirmation link to verify your account. After confirming, you can sign in."
      );
      router.replace("/(auth)/sign-in");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title={submitting ? "Creating…" : "Sign up"} onPress={onSubmit} disabled={submitting} />
      <View style={{ height: 12 }} />
      <Link href="/(auth)/sign-in">Already have an account? Sign in</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", gap: 12 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, height: 44,
  },
});

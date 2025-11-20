// app/(auth)/sign-up.jsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import { Link, useRouter } from "expo-router";
import CustomTextField from "../../components/CustomTextField";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../contexts/AuthProvider";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit() {
    setError("");

    if (!email || !username || !password) {
      setError("Please fill in email, username and password.");
      return;
    }

    try {
      setSubmitting(true);
      await signUp(email.trim(), password, username.trim());
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Sign up error", err);
      let message = err?.message || "Could not create your account.";
      if (message.toLowerCase().includes("password")) {
        message = "Password is too weak. Please choose a stronger password.";
      }
      if (message.toLowerCase().includes("user already registered")) {
        message = "An account with this email already exists. Try signing in.";
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center px-5 bg-white">
      <Text className="text-3xl font-bold mb-2 text-center">Create account</Text>
      <Text className="text-gray-500 mb-4 text-center">
        Sign up to start watching the latest videos.
      </Text>

      {error ? (
        <Text className="text-red-500 mb-3 text-center">{error}</Text>
      ) : null}

      <CustomTextField
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <CustomTextField
        label="Username"
        placeholder="Your display name"
        value={username}
        onChangeText={setUsername}
      />

      <CustomTextField
        label="Password"
        placeholder="Create a password"
        secure
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton
        title={submitting ? "Creating account..." : "Sign up"}
        onPress={onSubmit}
        isLoading={submitting}
        className="mt-2"
      />

      <View className="mt-4 flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <Link href="/(auth)/sign-in">
          <Text className="text-blue-600 font-semibold">Sign in</Text>
        </Link>
      </View>
    </View>
  );
}

// app/(auth)/sign-in.jsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import { Link, useRouter } from "expo-router";
import CustomTextField from "../../components/CustomTextField";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../contexts/AuthProvider";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit() {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Sign in error", err);
      const message = err?.message || "";
      if (message.toLowerCase().includes("invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(message || "Failed to sign in. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center px-5 bg-white">
      <Text className="text-3xl font-bold mb-2 text-center">Sign in</Text>
      <Text className="text-gray-500 mb-4 text-center">
        Enter your account details to continue.
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
        label="Password"
        placeholder="Your password"
        secure
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton
        title={submitting ? "Signing in..." : "Sign in"}
        onPress={onSubmit}
        isLoading={submitting}
        className="mt-2"
      />

      <View className="mt-4 flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <Link href="/(auth)/sign-up">
          <Text className="text-blue-600 font-semibold">Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

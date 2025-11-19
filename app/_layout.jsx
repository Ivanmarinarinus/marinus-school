// app/_layout.jsx
import React from "react";
import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "./contexts/AuthProvider";
import NavBar from "../components/NavBar";     // ✅ add this

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavBar />                               {/* ✅ show on all screens */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)/sign-in" />
        <Stack.Screen name="(auth)/sign-up" />
      </Stack>
    </AuthProvider>
  );
}

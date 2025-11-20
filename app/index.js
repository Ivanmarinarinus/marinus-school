// app/index.js
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "./contexts/AuthProvider";

export default function Index() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/onboarding" />;
}

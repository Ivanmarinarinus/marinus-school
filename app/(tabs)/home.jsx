import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthProvider"; // adjust ../../ if needed

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Welcome{user ? `, ${user.email}` : ""}!</Text>
    </View>
  );
}

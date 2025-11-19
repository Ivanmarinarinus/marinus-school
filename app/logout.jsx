// app/logout.jsx
import { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Logout() {
  useEffect(() => {
    (async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Sign out failed", error.message);
      }
      router.replace("/onboarding"); // or "/(auth)/sign-in"
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

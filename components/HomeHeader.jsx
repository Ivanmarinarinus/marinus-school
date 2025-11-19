import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../providers/AuthProvider";

export default function HomeHeader() {
  const { user, signOut } = useAuth();
  if (!user) {
    return (
      <View style={{ padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#eee" }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Marinus</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Link href="/(auth)/sign-in" style={{ color: "#2563EB", fontWeight: "600" }}>Sign in</Link>
          <Link href="/(auth)/sign-up" style={{ color: "#111827", fontWeight: "600" }}>Sign up</Link>
        </View>
      </View>
    );
  }

  const name = user.user_metadata?.username || user.email?.split("@")[0] || "You";

  return (
    <View style={{ padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#eee" }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Marinus</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontWeight: "700" }}>{name[0]?.toUpperCase()}</Text>
        </View>
        <Text style={{ fontWeight: "600" }}>{name}</Text>
        <Pressable onPress={signOut} style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#F3F4F6", borderRadius: 8 }}>
          <Text style={{ fontWeight: "600" }}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}

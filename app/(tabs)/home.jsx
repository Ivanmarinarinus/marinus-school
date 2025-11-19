import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

export default function Home() {
  const { user, signOut } = useAuth();

  const Header = () => {
    if (!user) {
      return (
        <View
          style={{
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800" }}>Marinus</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Link href="/(auth)/sign-in" style={{ color: "#2563EB", fontWeight: "700" }}>
              Sign in
            </Link>
            <Link href="/(auth)/sign-up" style={{ color: "#111827", fontWeight: "700" }}>
              Sign up
            </Link>
          </View>
        </View>
      );
    }

    const name =
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "You";

    return (
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderColor: "#eee",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Marinus</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "800" }}>{name[0]?.toUpperCase()}</Text>
          </View>
          <Text style={{ fontWeight: "700" }}>{name}</Text>
          <Pressable
            onPress={signOut}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: "#F3F4F6",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "700" }}>Sign out</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 6 }}>Home</Text>
        <Text style={{ color: "#4B5563" }}>
          {user ? "Welcome back! You are logged in." : "You are not signed in yet."}
        </Text>
      </View>
    </View>
  );
}

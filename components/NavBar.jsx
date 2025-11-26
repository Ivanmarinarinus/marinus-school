// components/NavBar.jsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../app/contexts/AuthProvider";

export default function NavBar() {
  const { user, signOut } = useAuth() || {};
  const router = useRouter();

  const initial = (
    user?.user_metadata?.username?.[0] ??
    user?.email?.[0] ??
    "U"
  ).toUpperCase();

  return (
    <View
      style={{
        height: 56,
        paddingHorizontal: 16,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        backgroundColor: "#fff",
      }}
    >
      {/* Left side: app title / home link */}
      <Link href="/home" asChild>
        <Pressable>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Home</Text>
        </Pressable>
      </Link>

      {/* Right side: user info or auth buttons */}
      {user ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* 👇 Avatar + username → go to Profile */}
          <Pressable
            onPress={() => router.push("/profile")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              maxWidth: 200,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#111827",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                }}
              >
                {initial}
              </Text>
            </View>

            <Text
              numberOfLines={1}
              style={{
                maxWidth: 160,
              }}
            >
              {user.user_metadata?.username ?? user.email}
            </Text>
          </Pressable>

          {/* Logout button */}
          <Pressable
            onPress={async () => {
              await signOut?.();
              router.replace("/onboarding");
            }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: "#F3F4F6",
            }}
          >
            <Text style={{ fontWeight: "600" }}>Sign out</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: "#F3F4F6",
              }}
            >
              <Text style={{ fontWeight: "600" }}>Sign in</Text>
            </Pressable>
          </Link>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: "#111827",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                }}
              >
                Sign up
              </Text>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
}

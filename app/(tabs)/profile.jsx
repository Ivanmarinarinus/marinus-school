// app/(tabs)/profile.jsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuth } from "../contexts/AuthProvider";
import InfoBox from "../../components/InfoBox";
import VideoCard from "../../components/VideoCard";
import { useAppwrite, getUserPosts } from "../../lib/useAppwrite";

export default function Profile() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  const username =
    user?.user_metadata?.username ||
    (user?.email ? user.email.split("@")[0] : "Guest");

  const email = user?.email ?? "";

  // Fetch posts created by this user
  const {
    data: posts,
    loading,
  } = useAppwrite(() => getUserPosts(username));

  const postsCount = posts.length;

  const handleLogoutPress = () => {
    // We already have a /logout route that signs out & redirects
    router.push("/logout");
  };

  const renderItem = ({ item }) => (
    <VideoCard
      title={item.title}
      creator={item.creator}
      thumbnail={item.thumbnail}
      videoUrl={item.videoUrl}
    />
  );

  if (initializing || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-gray-500">
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-2">
            {/* Avatar + username */}
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center mr-4">
                <Text className="text-xl font-bold text-gray-700">
                  {username?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900">
                  {username}
                </Text>
                {email ? (
                  <Text className="text-xs text-gray-500">
                    {email}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Info boxes */}
            <View className="mt-4 flex-row gap-3">
              <InfoBox
                title={postsCount.toString()}
                subtitle="Posts"
                containerStyles="flex-1"
              />
              <InfoBox
                title="0"
                subtitle="Followers"
                containerStyles="flex-1"
              />
            </View>

            {/* Section title */}
            <Text className="mt-6 mb-2 text-lg font-semibold text-gray-900">
              Your videos
            </Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View className="mt-10 px-4">
              <Text className="text-center text-gray-500">
                You haven't uploaded any videos yet.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          <View className="mt-6 mb-10 px-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogoutPress}
              className="w-full rounded-2xl bg-red-500 py-3 items-center"
            >
              <Text className="text-white font-semibold">
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {loading && (
        <View className="absolute inset-x-0 bottom-0 pb-4 items-center">
          <ActivityIndicator size="small" />
        </View>
      )}
    </SafeAreaView>
  );
}

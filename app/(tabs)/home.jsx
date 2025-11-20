// app/(tabs)/home.jsx
import React, { useMemo, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthProvider";
import SearchInput from "../../components/SearchInput";
import { latestVideos } from "../../constants";

export default function Home() {
  const { user, initializing } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const username =
    user?.user_metadata?.username ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "there";

  // Filter videos based on search text
  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return latestVideos;
    return latestVideos.filter((video) =>
      video.title.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (initializing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View className="px-4 pt-4 pb-2">
      {/* Welcome message */}
      <Text className="text-xl font-semibold text-gray-900">
        Welcome back, <Text className="font-extrabold">{username}</Text>
      </Text>

      {/* Logo / banner image */}
      <Image
        source={require("../../assets/images/bg.png")}
        className="w-full h-32 mt-4 rounded-xl"
        resizeMode="cover"
      />

      {/* Search input */}
      <View className="mt-4">
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for a video"
        />
      </View>

      {/* Latest videos label */}
      <Text className="mt-6 mb-1 text-lg font-semibold text-gray-900">
        Latest Videos
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View className="mx-4 mt-3 rounded-2xl bg-white border border-gray-200 h-40 items-center justify-center">
      {/* Placeholder white area for future video content */}
      <Text className="text-gray-500">{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

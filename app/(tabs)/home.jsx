// app/(tabs)/home.jsx
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthProvider";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { useAppwrite, getAllPosts } from "../../lib/useAppwrite";

export default function Home() {
  const { user, initializing } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const username =
    user?.user_metadata?.username ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "there";

  const {
    data: posts,
    loading,
    refetch,
  } = useAppwrite(getAllPosts);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) =>
      (post.title || "").toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const trendingPosts = useMemo(
    () => posts.slice(0, 5),
    [posts]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (initializing || loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-gray-500">
            Loading videos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderPost = ({ item }) => (
    <VideoCard
      title={item.title}
      creator={item.creator}
      thumbnail={item.thumbnail}
      videoUrl={item.videoUrl}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-xl font-semibold text-gray-900">
          Welcome back, <Text className="font-extrabold">{username}</Text>
        </Text>
        <Text className="mt-1 text-gray-500">
          Watch what others are posting or upload your own video.
        </Text>

        <View className="mt-4">
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for a video"
          />
        </View>

        <View className="mt-6">
          <Text className="mb-2 text-lg font-semibold text-gray-900">
            Trending now
          </Text>
          <Trending posts={trendingPosts} />
        </View>

        <Text className="mt-6 mb-1 text-lg font-semibold text-gray-900">
          Latest Videos
        </Text>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

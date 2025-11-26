// app/(tabs)/home.jsx
import React, {
  useCallback,
  useEffect,
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
import { supabase } from "../../lib/supabase";

export default function Home() {
  const { user, initializing } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const username =
    user?.user_metadata?.username ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "there";

  /**
   * getAllPosts
   * Fetch all posts from Supabase and update state.
   */
  const getAllPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        return;
      }

      const normalised = (data || []).map((post) => ({
        id: post.id?.toString(),
        title: post.title || "Untitled video",
        username: post.username || post.owner || "",
        created_at: post.created_at,
      }));

      setPosts(normalised);
    } catch (err) {
      console.error("Unexpected error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  // Fetch posts when the home screen loads
  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllPosts();
    setRefreshing(false);
  }, [getAllPosts]);

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      (p.title || "").toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  // First few posts used as "trending"
  const trendingPosts = useMemo(() => posts.slice(0, 5), [posts]);

  const renderPost = ({ item }) => (
    <View className="px-4 py-3 border-b border-gray-100">
      <Text className="text-base font-semibold text-gray-900">
        {item.title || `Video ${item.id}`}
      </Text>
      {item.username ? (
        <Text className="mt-1 text-xs text-gray-500">
          by {item.username}
        </Text>
      ) : null}
      {item.created_at ? (
        <Text className="mt-1 text-xs text-gray-400">
          {new Date(item.created_at).toLocaleString()}
        </Text>
      ) : null}
    </View>
  );

  if (initializing || loadingPosts) {
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header (outside FlatList so SearchInput keeps focus) */}
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

        {/* Trending section */}
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

      {/* Main posts list */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

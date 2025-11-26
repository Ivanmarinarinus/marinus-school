// app/search/[query].jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchInput from "../../components/SearchInput";
import VideoCard from "../../components/VideoCard";
import { useAppwrite, searchPosts } from "../../lib/useAppwrite";

export default function SearchScreen() {
  const { query } = useLocalSearchParams();
  const router = useRouter();

  const currentQuery =
    typeof query === "string"
      ? query
      : Array.isArray(query)
      ? query[0]
      : "";

  // Local state for the text field
  const [searchText, setSearchText] = useState(currentQuery);

  // When the URL param changes (e.g., new /search/foo), sync input text
  useEffect(() => {
    setSearchText(currentQuery);
  }, [currentQuery]);

  // Fetch search results based on the current query
  const {
    data: results,
    loading,
  } = useAppwrite(() => searchPosts(currentQuery));

  const handleSubmit = (term) => {
    // Push a new /search/<term> route, which will refresh results
    router.push(`/search/${encodeURIComponent(term)}`);
  };

  const renderItem = ({ item }) => (
    <VideoCard
      title={item.title}
      creator={item.creator}
      thumbnail={item.thumbnail}
      videoUrl={item.videoUrl}
    />
  );

  const emptyMessage = currentQuery
    ? `No videos found for "${currentQuery}".`
    : "Start typing to search for videos.";

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header + search bar */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-xl font-semibold text-gray-900">
          Search results for{" "}
          <Text className="font-extrabold">
            {currentQuery ? `"${currentQuery}"` : "..."}
          </Text>
        </Text>

        <View className="mt-4">
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            onSubmit={handleSubmit}
            placeholder="Search again"
          />
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-gray-500">
            Searching videos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View className="mt-10 px-4">
              <Text className="text-center text-gray-500">
                {emptyMessage}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

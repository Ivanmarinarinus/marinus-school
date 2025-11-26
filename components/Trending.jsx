// components/Trending.jsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import EmptyState from "./EmptyState";

/**
 * Trending component
 *
 * Props:
 *  - posts: array of video objects with at least { id, title? }
 *
 * Shows a horizontal FlatList of trending videos.
 * If there are no posts, it shows EmptyState using ListEmptyComponent.
 */
export default function Trending({ posts = [] }) {
  const renderItem = ({ item }) => (
    <View className="mr-3 w-40 h-28 rounded-2xl bg-gray-100 justify-center px-3">
      <Text
        className="text-sm font-semibold text-gray-900"
        numberOfLines={2}
      >
        {item.title || `Video ${item.id}`}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      ListEmptyComponent={<EmptyState />}
      contentContainerStyle={{ paddingVertical: 4 }}
    />
  );
}

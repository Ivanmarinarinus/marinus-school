// components/Trending.jsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import EmptyState from "./EmptyState";

/**
 * Trending
 *
 * Horizontal list of trending videos.
 * Props:
 *  - posts: [{ id, title, creator }]
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
      {item.creator ? (
        <Text
          className="mt-1 text-xs text-gray-500"
          numberOfLines={1}
        >
          {item.creator}
        </Text>
      ) : null}
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      // If there are no posts yet, show the EmptyState prompt
      ListEmptyComponent={<EmptyState />}
      contentContainerStyle={{ paddingVertical: 4 }}
    />
  );
}

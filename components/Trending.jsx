// components/Trending.jsx
import React, { useRef, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import TrendingVideoCard from "./TrendingVideoCard";
import EmptyState from "./EmptyState";

/**
 * Trending
 *
 * Props:
 *  - posts: array of video objects
 *  - loading: boolean (optional)
 */
export default function Trending({ posts = [], loading = false }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) return;
    const firstVisible = viewableItems[0];
    if (firstVisible.index != null) {
      setActiveIndex(firstVisible.index);
    }
  }).current;

  if (loading) {
    return (
      <View className="w-full h-32 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!posts.length) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item, index }) => (
        <TrendingVideoCard
          item={item}
          isActive={index === activeIndex}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 4,
        paddingHorizontal: 8,
      }}
      snapToAlignment="start"
      decelerationRate="fast"
      // These next 2 make it feel smoother when swiping
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  );
}

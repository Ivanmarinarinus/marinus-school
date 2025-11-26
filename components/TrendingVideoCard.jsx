// components/TrendingVideoCard.jsx
import React, { useRef, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import { images } from "../constants";

/**
 * TrendingVideoCard
 *
 * Props:
 *  - item: { title, creator, thumbnail, videoUrl }
 *  - isActive: boolean (true when this card is centered / focused)
 */
export default function TrendingVideoCard({ item, isActive }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleTogglePlay = async () => {
    // If no video URL, just toggle the state for demo purposes
    if (!item.videoUrl || !videoRef.current) {
      setIsPlaying((prev) => !prev);
      return;
    }

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.replayAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Trending video play error:", err);
      setIsPlaying(false);
    }
  };

  const handleStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  // Bigger zoom difference so you really see the active card
  const scaleTo = isActive ? 1.12 : 0.9;
  const shadowStyle = isActive
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
      }
    : {};

  return (
    <Animatable.View
      duration={250}
      easing="ease-out"
      style={[
        {
          width: 190,
          marginHorizontal: 8,
          transform: [{ scale: scaleTo }],
        },
        shadowStyle,
      ]}
      transition={["transform"]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleTogglePlay}
        className="rounded-2xl overflow-hidden bg-black"
      >
        <View className="w-full h-36 bg-black">
          {isPlaying && item.videoUrl ? (
            <Video
              ref={videoRef}
              source={{ uri: item.videoUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              isLooping
              onPlaybackStatusUpdate={handleStatusUpdate}
            />
          ) : (
            <Image
              source={
                item.thumbnail ? { uri: item.thumbnail } : images.video
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          )}
        </View>

        {/* Simple overlay bar at the bottom */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1">
          <Text
            className="text-[11px] font-semibold text-white"
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>

      <Text
        className="mt-2 text-xs font-semibold text-gray-900"
        numberOfLines={1}
      >
        {item.title}
      </Text>
      <Text className="text-[11px] text-gray-500" numberOfLines={1}>
        {item.creator}
      </Text>
    </Animatable.View>
  );
}

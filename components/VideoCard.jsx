// components/VideoCard.jsx
import React, { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { images } from "../constants";

/**
 * VideoCard
 *
 * Props:
 *  - title
 *  - creator
 *  - thumbnail (URL or null)
 *  - videoUrl (URL or null)
 */
export default function VideoCard({
  title = "Untitled video",
  creator = "Unknown creator",
  thumbnail = null,
  videoUrl = null,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleTogglePlay = async () => {
    // If we don't have a video URL, just toggle state text
    if (!videoUrl || !videoRef.current) {
      setIsPlaying((prev) => !prev);
      return;
    }

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        // replay from start each time
        await videoRef.current.replayAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error controlling video:", err);
      // In case of error, still flip the state text so UI responds
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <View className="flex-row items-center mx-4 mt-3 mb-1 rounded-2xl bg-white border border-gray-200 px-3 py-3">
      {/* Thumbnail / Video area */}
      <View className="w-24 h-16 mr-3 rounded-xl overflow-hidden bg-gray-200 items-center justify-center">
        {isPlaying && videoUrl ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            isLooping
          />
        ) : (
          <Image
            source={
              thumbnail ? { uri: thumbnail } : images.video
            }
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Title + creator + state text */}
      <View className="flex-1">
        <Text
          className="text-base font-semibold text-gray-900"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          className="mt-1 text-xs text-gray-500"
          numberOfLines={1}
        >
          {creator}
        </Text>
        <Text className="mt-1 text-[11px] text-gray-400">
          {isPlaying ? "Now playing" : "Paused"}
        </Text>
      </View>

      {/* Play / Pause button */}
      <TouchableOpacity
        onPress={handleTogglePlay}
        className="ml-3 w-10 h-10 rounded-full bg-gray-900 items-center justify-center"
        activeOpacity={0.8}
      >
        <Text className="text-white text-xs font-semibold">
          {isPlaying ? "Pause" : "Play"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

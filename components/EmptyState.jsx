// components/EmptyState.jsx
import React from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "./CustomButton";
import { images } from "../constants";

/**
 * Shown when there are no posts.
 * Prompts the user to upload / create a video.
 */
export default function EmptyState() {
  const router = useRouter();

  const handleCreateVideo = () => {
    // Go to the Create tab / screen
    router.push("/(tabs)/create");
  };

  return (
    <View className="items-center justify-center px-6 py-10">
      <Image
        source={images.empty}
        className="w-40 h-40 mb-6"
        resizeMode="contain"
      />

      <Text className="text-xl font-semibold text-gray-900 text-center">
        No videos found
      </Text>
      <Text className="mt-2 text-base text-gray-500 text-center">
        Be the first one to upload a video.
      </Text>

      <View className="mt-6 w-full max-w-xs">
        <CustomButton
          title="Create Video"
          onPress={handleCreateVideo}
          className="w-full"
        />
      </View>
    </View>
  );
}

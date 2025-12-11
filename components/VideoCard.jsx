// components/VideoCard.jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useEvent } from "expo";
import { VideoView, useVideoPlayer } from "expo-video";

export default function VideoCard(props) {
  // Accept several calling styles:
  // <VideoCard video={item} />, <VideoCard post={item} />, or <VideoCard {...item} />
  const data = props.video || props.post || props.item || props;

  // If nothing was passed, don't crash — just render nothing
  if (!data) {
    console.warn("VideoCard: no data passed as props");
    return null;
  }

  const videoUrl = data.video_url || data.videoUrl || null;
  const title = data.title || "Untitled video";
  const creator = data.creator || "Unknown creator";

  if (!videoUrl) {
    console.warn("VideoCard: missing video_url for item", data);
    return null;
  }

  // Set up the player with expo-video
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.pause(); // start paused
  });

  // Track playing state for the button label
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handleTogglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View className="w-64 mr-4">
      {/* Video display */}
      <View className="w-full h-40 rounded-2xl overflow-hidden bg-slate-800">
        <VideoView
          className="w-full h-full"
          player={player}
          nativeControls={false}
          playsInline
          contentFit="cover"
        />

        {/* Play / Pause overlay */}
        <TouchableOpacity
          onPress={handleTogglePlay}
          activeOpacity={0.8}
          className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60"
        >
          <Text className="text-white text-xs font-semibold">
            {isPlaying ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <Text
        className="mt-2 text-sm font-semibold text-slate-900"
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text className="text-xs text-slate-500">{creator}</Text>
    </View>
  );
}

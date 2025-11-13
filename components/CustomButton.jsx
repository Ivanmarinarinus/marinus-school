import { ActivityIndicator, Pressable, Text } from "react-native";

export default function CustomButton({ title, onPress, isLoading, className = "" }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={`h-12 rounded-2xl items-center justify-center bg-black ${isLoading ? "opacity-70" : ""} ${className}`}
      android_ripple={{ color: "#ffffff20" }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text className="text-white font-semibold">{title}</Text>
      )}
    </Pressable>
  );
}

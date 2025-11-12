import { View, Text, Pressable } from "react-native";
import { Link, router } from "expo-router";

export default function Profile() {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-white">
      <Text className="text-2xl font-bold">Profile</Text>
      <Pressable onPress={() => router.back()} className="px-4 py-2 rounded-2xl bg-black">
        <Text className="text-white">← Go back</Text>
      </Pressable>
      <Link href="/" className="text-blue-600 underline">Go Home</Link>
    </View>
  );
}

import { View, Text } from "react-native";

export default function TwCheck() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold text-blue-600">Tailwind Works 🎉</Text>
      <View className="mt-4 h-14 w-14 rounded-full bg-black/80" />
    </View>
  );
}

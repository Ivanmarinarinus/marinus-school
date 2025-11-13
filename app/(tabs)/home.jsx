import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-xl font-semibold">Home</Text>
      <Link href="/search/react-native" className="text-blue-600 underline mt-2">
        Try a search route
      </Link>
    </View>
  );
}

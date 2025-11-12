import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-xl font-semibold">Hello web 👋</Text>
      <Link href="/profile" className="mt-2 text-blue-600 underline">
        Go to Profile
      </Link>
    </View>
  );
}

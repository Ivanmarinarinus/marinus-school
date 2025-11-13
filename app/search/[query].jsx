import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function SearchQuery() {
  const { query } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Search for: {String(query)}</Text>
    </View>
  );
}

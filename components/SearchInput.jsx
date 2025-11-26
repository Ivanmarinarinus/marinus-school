// components/SearchInput.jsx
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

export default function SearchInput({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search for a video",
}) {
  const handleChangeText = (text) => {
    if (typeof onChangeText === "function") {
      onChangeText(text);
    }
  };

  const handleSearchPress = () => {
    const trimmed = (value || "").trim();

    if (!trimmed) {
      Alert.alert(
        "Empty search",
        "Please enter a search term before searching."
      );
      return;
    }

    if (typeof onSubmit === "function") {
      onSubmit(trimmed);
    }
  };

  return (
    <View className="flex-row items-center bg-gray-100 rounded-2xl px-3 py-2">
      <TextInput
        className="flex-1 text-base text-gray-900"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        blurOnSubmit={false}
        onSubmitEditing={handleSearchPress}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleSearchPress}
      >
        {/* acts as a search / magnifying glass icon */}
        <Image
          source={require("../assets/images/favicon.png")}
          className="w-5 h-5"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

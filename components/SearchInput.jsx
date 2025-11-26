// components/SearchInput.jsx
import React from "react";
import { View, TextInput, TouchableOpacity, Image } from "react-native";

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search for a video",
}) {
  const handleChangeText = (text) => {
    // Always pass the full text back up
    if (typeof onChangeText === "function") {
      onChangeText(text);
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
      />
      <TouchableOpacity activeOpacity={0.7}>
        {/* Simple placeholder icon */}
        <Image
          source={require("../assets/images/favicon.png")}
          className="w-5 h-5"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

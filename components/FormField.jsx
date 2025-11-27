// components/FormField.jsx
import React from "react";
import { View, Text, TextInput } from "react-native";

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder = "",
  multiline = false,
  numberOfLines = 1,
}) {
  return (
    <View className="mb-4">
      {label ? (
        <Text className="mb-1 text-sm font-semibold text-gray-700">
          {label}
        </Text>
      ) : null}

      <TextInput
        className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-base text-gray-900"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

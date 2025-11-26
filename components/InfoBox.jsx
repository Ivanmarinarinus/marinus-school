// components/InfoBox.jsx
import React from "react";
import { View, Text } from "react-native";

export default function InfoBox({
  title,
  subtitle,
  containerStyles = "",
  titleStyles = "",
  subtitleStyles = "",
}) {
  return (
    <View
      className={`rounded-2xl bg-gray-100 px-4 py-3 justify-center ${containerStyles}`}
    >
      <Text
        className={`text-lg font-bold text-gray-900 ${titleStyles}`}
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text
        className={`mt-1 text-xs text-gray-500 ${subtitleStyles}`}
        numberOfLines={1}
      >
        {subtitle}
      </Text>
    </View>
  );
}

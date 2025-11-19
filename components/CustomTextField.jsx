import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // npm i @expo/vector-icons

export default function CustomTextField({
  label, placeholder, value, onChangeText,
  keyboardType = "default", secure = false,
  autoCapitalize = "none", autoCorrect = false,
  containerStyle = {},
}) {
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={[{ marginBottom: 14 }, containerStyle]}>
      {!!label && <Text style={{ marginBottom: 6, color: "#111827", fontWeight: "600" }}>{label}</Text>}

      <View style={{
        borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff",
        borderRadius: 12, paddingHorizontal: 12, height: 48,
        flexDirection: "row", alignItems: "center",
      }}>
        <TextInput
          value={value} onChangeText={onChangeText} placeholder={placeholder}
          keyboardType={keyboardType} secureTextEntry={hidden}
          autoCapitalize={autoCapitalize} autoCorrect={autoCorrect}
          style={{ flex: 1, fontSize: 16 }}
        />
        {secure && (
          <Pressable onPress={() => setHidden(v => !v)} hitSlop={12}>
            <Ionicons name={hidden ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

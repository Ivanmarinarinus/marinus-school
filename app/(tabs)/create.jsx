// app/(tabs)/create.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { useRouter } from "expo-router";

import { useAuth } from "../contexts/AuthProvider";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { supabase } from "../../lib/supabase";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const initialForm = {
  title: "",
  video: null, // { name, type, size, uri }
  thumbnail: null, // { name, type, size, uri }
  prompt: "",
};

// Upload helper – works for both video and thumbnail
async function uploadToSupabase(folder, asset, isVideo) {
  if (!asset?.uri) return null;

  const guessExtFromName = (name) => {
    if (!name) return null;
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop() : null;
  };

  const ext =
    guessExtFromName(asset.name) ||
    guessExtFromName(asset.uri.split(/[?#]/)[0]) ||
    (isVideo ? "mp4" : "jpg");

  const random = Math.random().toString(36).slice(2);
  const filePath = `${folder}/${Date.now()}-${random}.${ext}`;

  const response = await fetch(asset.uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from("videos")
    .upload(filePath, blob, {
      contentType:
        asset.type || (isVideo ? "video/mp4" : "image/jpeg"),
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("videos")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export default function Create() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const username =
    user?.user_metadata?.username ||
    (user?.email ? user.email.split("@")[0] : "anonymous");

  // ---- Permissions ----
  const ensureMediaPermission = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your gallery to pick videos and images."
      );
      return false;
    }
    return true;
  };

  // ---- Pickers using expo-image-picker ----

  const handlePickVideo = async () => {
    const ok = await ensureMediaPermission();
    if (!ok) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const file = result.assets?.[0];
      if (!file) return;

      const asset = {
        name:
          file.fileName ||
          `video-${Date.now()}.mp4`,
        type: file.mimeType || "video/mp4",
        size: file.fileSize ?? 0,
        uri: file.uri,
      };

      console.log("Picked video asset:", asset);

      if (asset.size && asset.size > MAX_FILE_SIZE) {
        Alert.alert(
          "File too large",
          "Please choose a video smaller than 50 MB."
        );
        return;
      }

      setForm((prev) => ({ ...prev, video: asset }));
    } catch (err) {
      console.error("Video pick error:", err);
      Alert.alert("Error", "Could not select video. Please try again.");
    }
  };

  const handlePickThumbnail = async () => {
    const ok = await ensureMediaPermission();
    if (!ok) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (result.canceled) return;

      const file = result.assets?.[0];
      if (!file) return;

      const asset = {
        name:
          file.fileName ||
          `thumb-${Date.now()}.jpg`,
        type: file.mimeType || "image/jpeg",
        size: file.fileSize ?? 0,
        uri: file.uri,
      };

      console.log("Picked thumbnail asset:", asset);

      if (asset.size && asset.size > MAX_FILE_SIZE) {
        Alert.alert(
          "File too large",
          "Please choose an image smaller than 50 MB."
        );
        return;
      }

      setForm((prev) => ({ ...prev, thumbnail: asset }));
    } catch (err) {
      console.error("Thumbnail pick error:", err);
      Alert.alert(
        "Error",
        "Could not select thumbnail. Please try again."
      );
    }
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle || !form.video) {
      Alert.alert(
        "Missing fields",
        "Please add at least a title and a video."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload video and thumbnail
      const videoUrl = await uploadToSupabase(
        "videos",
        form.video,
        true
      );

      const thumbUrl = form.thumbnail
        ? await uploadToSupabase(
            "thumbnails",
            form.thumbnail,
            false
          )
        : null;

      const { error } = await supabase.from("posts").insert({
        title: trimmedTitle,
        creator: username,
        video_url: videoUrl,
        thumbnail: thumbUrl,
        prompt: form.prompt.trim() || null,
      });

      if (error) {
        console.error("Error inserting post:", error);
        throw error;
      }

      setForm(initialForm);

      Alert.alert("Success", "Your video has been uploaded.", [
        {
          text: "OK",
          onPress: () => router.push("/home"),
        },
      ]);
    } catch (err) {
      console.error("Upload flow error:", err);
      Alert.alert(
        "Upload failed",
        "Something went wrong while uploading. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const videoPreview = form.video?.uri;
  const thumbnailPreview = form.thumbnail?.uri;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mt-4 text-2xl font-bold text-gray-900">
          Upload Video
        </Text>
        <Text className="mt-1 mb-4 text-sm text-gray-500">
          Pick a video and thumbnail from your gallery and share it.
        </Text>

        {/* Title */}
        <FormField
          label="Title"
          value={form.title}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, title: text }))
          }
          placeholder="Give your video a title"
        />

        {/* Video picker */}
        <Text className="mb-1 text-sm font-semibold text-gray-700">
          Video (from gallery)
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickVideo}
          className="mb-4 h-48 items-center justify-center overflow-hidden rounded-2xl bg-gray-100"
        >
          {videoPreview ? (
            <Video
              source={{ uri: videoPreview }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              isMuted
            />
          ) : (
            <Text className="text-sm text-gray-500">
              Tap to select a video from your gallery
            </Text>
          )}
        </TouchableOpacity>

        {/* Thumbnail picker */}
        <Text className="mb-1 text-sm font-semibold text-gray-700">
          Thumbnail (from gallery)
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickThumbnail}
          className="mb-4 h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100"
        >
          {thumbnailPreview ? (
            <Image
              source={{ uri: thumbnailPreview }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-sm text-gray-500">
              Tap to select a thumbnail image
            </Text>
          )}
        </TouchableOpacity>

        {/* Prompt */}
        <FormField
          label="AI Prompt (optional)"
          value={form.prompt}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, prompt: text }))
          }
          placeholder="Describe how AI helped create this video"
          multiline
          numberOfLines={4}
        />

        <CustomButton
          title="Submit & Publish"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          className="mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

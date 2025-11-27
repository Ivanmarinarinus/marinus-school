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
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import { useRouter } from "expo-router";

import { useAuth } from "../contexts/AuthProvider";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { supabase } from "../../lib/supabase";

const initialForm = {
  title: "",
  video: null,      // DocumentPicker asset
  thumbnail: null,  // DocumentPicker asset
  prompt: "",
};

async function uploadToSupabase(folder, asset, isVideo) {
  if (!asset?.uri) return null;

  const ext =
    asset.name?.split(".").pop() || (isVideo ? "mp4" : "jpg");
  const random = Math.random().toString(36).slice(2);
  const filePath = `${folder}/${Date.now()}-${random}.${ext}`;

  const response = await fetch(asset.uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from("videos") // single bucket, folders = videos/thumbnails
    .upload(filePath, blob, {
      contentType:
        asset.mimeType || (isVideo ? "video/mp4" : "image/jpeg"),
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

  const handlePickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;

      setForm((prev) => ({ ...prev, video: asset }));
    } catch (err) {
      console.error("Video pick error:", err);
      Alert.alert("Error", "Could not select video. Please try again.");
    }
  };

  const handlePickThumbnail = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;

      setForm((prev) => ({ ...prev, thumbnail: asset }));
    } catch (err) {
      console.error("Thumbnail pick error:", err);
      Alert.alert(
        "Error",
        "Could not select thumbnail. Please try again."
      );
    }
  };

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

      // Upload video + thumbnail to Supabase Storage
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

      // Save post row in Supabase
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
          Share a new video with your followers.
        </Text>

        {/* Title field */}
        <FormField
          label="Title"
          value={form.title}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, title: text }))
          }
          placeholder="Give your video a title"
        />

        {/* Video upload */}
        <Text className="mb-1 text-sm font-semibold text-gray-700">
          Video
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
              Tap to select a video file
            </Text>
          )}
        </TouchableOpacity>

        {/* Thumbnail upload */}
        <Text className="mb-1 text-sm font-semibold text-gray-700">
          Thumbnail
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

        {/* AI Prompt */}
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

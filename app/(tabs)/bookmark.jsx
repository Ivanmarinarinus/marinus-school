// app/(tabs)/bookmark.jsx
// Creator Hub – Idea Generator + Idea Board

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthProvider";
import { supabase } from "../../lib/supabase";
import { ideaPrompts } from "../../constants";

const STATUS_OPTIONS = ["idea", "planning", "posted"];

function StatusPills({ value, onChange }) {
  return (
    <View className="flex-row gap-2 mt-2">
      {STATUS_OPTIONS.map((status) => {
        const selected = value === status;
        return (
          <TouchableOpacity
            key={status}
            onPress={() => onChange(status)}
            className={`px-3 py-1 rounded-full border ${
              selected ? "bg-black border-black" : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={`text-xs font-semibold capitalize ${
                selected ? "text-white" : "text-gray-700"
              }`}
            >
              {status}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function IdeaCard({ item, onPress, onDelete }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-3 shadow-sm"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900">
            {item.title}
          </Text>
          {item.description ? (
            <Text
              className="text-xs text-gray-500 mt-1"
              numberOfLines={3}
            >
              {item.description}
            </Text>
          ) : null}
        </View>
        <View className="items-end">
          <View className="px-3 py-1 rounded-full bg-gray-100">
            <Text className="text-[11px] font-semibold text-gray-700 capitalize">
              {item.status || "idea"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onDelete(item)} className="mt-2">
            <Text className="text-[11px] text-red-500 font-semibold">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ onRandom, onNew }) {
  return (
    <View className="flex-1 items-center justify-center mt-10">
      <Text className="text-lg font-semibold text-gray-800 mb-2">
        No ideas yet
      </Text>
      <Text className="text-sm text-gray-500 text-center px-8 mb-4">
        Tap "Give me an idea" or "New idea" to start building your idea board.
      </Text>
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="bg-black rounded-xl px-4 py-2"
          onPress={onRandom}
        >
          <Text className="text-white text-sm font-semibold">
            Give me an idea
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-gray-300 rounded-xl px-4 py-2"
          onPress={onNew}
        >
          <Text className="text-gray-800 text-sm font-semibold">
            New idea
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CreatorHubScreen() {
  const { user } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idea");

  const openModalForNew = useCallback(() => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("idea");
    setModalVisible(true);
  }, []);

  const openModalWithPrompt = useCallback(() => {
    if (!ideaPrompts || ideaPrompts.length === 0) {
      Alert.alert("No prompts", "The prompts list is empty.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * ideaPrompts.length);
    const prompt = ideaPrompts[randomIndex];

    setEditingId(null);
    setTitle(prompt);
    setDescription("");
    setStatus("idea");
    setModalVisible(true);
  }, []);

  const openModalForEdit = useCallback((idea) => {
    setEditingId(idea.id);
    setTitle(idea.title || "");
    setDescription(idea.description || "");
    setStatus(idea.status || "idea");
    setModalVisible(true);
  }, []);

  const fetchIdeas = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading ideas:", error);
        Alert.alert("Error", "Could not load your ideas.");
      } else {
        setIdeas(data || []);
      }
    } catch (err) {
      console.error("Unexpected error loading ideas:", err);
      Alert.alert("Error", "Unexpected error loading ideas.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleSaveIdea = useCallback(async () => {
    if (!user) {
      Alert.alert("Not signed in", "You must be signed in to save ideas.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a title for your idea.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("ideas")
          .update({
            title: title.trim(),
            description: description.trim() || null,
            status,
          })
          .eq("id", editingId);

        if (error) {
          console.error("Error updating idea:", error);
          Alert.alert("Error", "Could not update idea.");
          return;
        }
      } else {
        const { error } = await supabase.from("ideas").insert({
          title: title.trim(),
          description: description.trim() || null,
          status,
          user_id: user.id,
        });

        if (error) {
          console.error("Error inserting idea:", error);
          Alert.alert("Error", "Could not create idea.");
          return;
        }
      }

      setModalVisible(false);
      await fetchIdeas();
    } catch (err) {
      console.error("Unexpected error saving idea:", err);
      Alert.alert("Error", "Unexpected error saving idea.");
    } finally {
      setSaving(false);
    }
  }, [user, title, description, status, editingId, fetchIdeas]);

const handleDeleteIdea = useCallback(
  (idea) => {
    Alert.alert(
      "Delete idea",
      "Are you sure you want to delete this idea?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("ideas")
                .delete()
                .eq("id", idea.id)
                .eq("user_id", user.id); // extra safety

              if (error) {
                console.error("Error deleting idea:", error);
                Alert.alert(
                  "Error deleting idea",
                  error.message ?? "Could not delete idea."
                );
                return;
              }

              await fetchIdeas(); // refresh list
            } catch (err) {
              console.error("Unexpected error deleting idea:", err);
              Alert.alert(
                "Error",
                err.message ?? "Unexpected error deleting idea."
              );
            }
          },
        },
      ]
    );
  },
  [user, fetchIdeas]
);


  const renderItem = ({ item }) => (
    <IdeaCard
      item={item}
      onPress={openModalForEdit}
      onDelete={handleDeleteIdea}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <Text className="text-2xl font-bold text-gray-900 mt-2">
          Creator Hub
        </Text>
        <Text className="text-sm text-gray-500 mt-1 mb-4">
          Generate and organize ideas for your next videos.
        </Text>

        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            className="flex-1 bg-black rounded-2xl items-center justify-center py-3"
            onPress={openModalWithPrompt}
          >
            <Text className="text-white font-semibold text-sm">
              Give me an idea
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 border border-gray-300 rounded-2xl items-center justify-center py-3"
            onPress={openModalForNew}
          >
            <Text className="text-gray-900 font-semibold text-sm">
              New idea
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" />
          </View>
        ) : ideas.length === 0 ? (
          <EmptyState
            onRandom={openModalWithPrompt}
            onNew={openModalForNew}
          />
        ) : (
          <FlatList
            data={ideas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Add / Edit idea modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl px-4 pt-4 pb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit idea" : "New idea"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-sm text-gray-500 font-semibold">
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-xs font-semibold text-gray-700 mb-1">
              Title
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900"
              placeholder="My next video idea..."
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />

            <Text className="text-xs font-semibold text-gray-700 mt-3 mb-1">
              Description (optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 h-24"
              placeholder="Add some details so you remember what to film."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text className="text-xs font-semibold text-gray-700 mt-3">
              Status
            </Text>
            <StatusPills value={status} onChange={setStatus} />

            <TouchableOpacity
              className={`mt-5 rounded-2xl py-3 items-center ${
                saving ? "bg-gray-400" : "bg-black"
              }`}
              onPress={handleSaveIdea}
              disabled={saving}
            >
              <Text className="text-white font-semibold text-sm">
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save changes"
                  : "Save idea"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

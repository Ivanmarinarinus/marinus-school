// lib/useAppwrite.js
import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";

// Map a Supabase row into the shape our app uses
function mapPost(post) {
  return {
    id: post.id?.toString(),
    title: post.title || "Untitled video",
    creator: post.creator || "ivan",
    thumbnail: post.thumbnail || null,
    videoUrl: post.video_url || null,
    created_at: post.created_at,
  };
}

/**
 * getAllPosts
 *
 * Fetch all video posts from Supabase.
 */
export const getAllPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (data || []).map(mapPost);
};

/**
 * getLatestPosts
 *
 * Latest 7 posts, newest first (for Trending section).
 */
export const getLatestPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(7);

  if (error) {
    console.error("Error fetching latest posts:", error);
  }

  return (data || []).map(mapPost);
};

/**
 * searchPosts
 *
 * Search posts by title (case-insensitive) in Supabase.
 * Used by the Search screen.
 */
export const searchPosts = async (query) => {
  const trimmed = (query || "").trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .ilike("title", `%${trimmed}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching posts:", error);
  }

  return (data || []).map(mapPost);
};

/**
 * getUserPosts
 *
 * Fetch posts created by a specific user.
 * Here we use the `creator` text field to match the logged-in username.
 */
export const getUserPosts = async (creatorName) => {
  const name = (creatorName || "").trim();
  if (!name) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("creator", name)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user posts:", error);
  }

  return (data || []).map(mapPost);
};

/**
 * useAppwrite (Supabase version)
 *
 * Generic hook that accepts a fetch function and manages:
 *  - data
 *  - loading
 *  - refetch()
 */
export function useAppwrite(fn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fn();
      setData(result);
    } catch (err) {
      console.error("useAppwrite fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [fn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
}

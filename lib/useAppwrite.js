// lib/useAppwrite.js
import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";

/**
 * getAllPosts
 *
 * Fetch all video posts from Supabase.
 * Matches your `posts` table:
 *  - id (uuid)
 *  - title (text)
 *  - creator (text)
 *  - thumbnail (text, nullable)
 *  - video_url (text, nullable)
 *  - created_at (timestamptz)
 */
export const getAllPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }

  return (data || []).map((post) => ({
    id: post.id?.toString(),
    title: post.title || "Untitled video",
    creator: post.creator || "Unknown creator",
    thumbnail: post.thumbnail || null,
    videoUrl: post.video_url || null,
    created_at: post.created_at,
  }));
};

/**
 * useAppwrite (really Supabase 😄)
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

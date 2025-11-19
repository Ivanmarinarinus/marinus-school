// app/contexts/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // keep session in sync
  useEffect(() => {
    let mounted = true;

    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (mounted) {
        if (error) console.warn("getSession error:", error);
        setUser(session?.user ?? null);
        setInitializing(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async ({ email, password, username }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        // NOTE: if you want an email confirmation link to come back to your app,
        // set redirectTo to your dev URL, e.g. "http://localhost:8081"
        // redirectTo: "http://localhost:8081"
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Sign out failed", error.message);
  }, []);

  const value = { user, initializing, signUp, signIn, signOut };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

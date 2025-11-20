// app/contexts/AuthProvider.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../../lib/supabase";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load initial user and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!mounted) return;

        if (error) {
          console.warn("Error getting user", error);
          setUser(null);
        } else {
          setUser(data?.user ?? null);
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      throw error;
    }

    return data.user;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data.user;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, []);

  const value = { user, initializing, signUp, signIn, signOut };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

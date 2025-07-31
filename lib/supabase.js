import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { supabaseAnonKey, supabaseUrl } from "../constants";

// Create and configure a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Use React Native's AsyncStorage for auth persistence
    autoRefreshToken: true, // Automatically refresh expired tokens
    persistSession: true, // Keep user signed in after app restarts
    detectSessionInUrl: false, // Not needed in mobile apps
  },
  realtime: {
    enabled: false, // Disable Realtime if you’re not using live subscriptions
  },
});

// Start or stop session token auto-refresh based on app state
// Ensures the session stays active when app is foregrounded
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    // Resume token auto-refresh when app becomes active
    supabase.auth.startAutoRefresh();
  } else {
    // Stop refreshing tokens when app is backgrounded to save resources
    supabase.auth.stopAutoRefresh();
  }
});

import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import { AuthProvider, useAuth } from "./contexts/authContext";

/**
 * Root layout component wrapped in providers:
 * - SafeAreaProvider for handling notches/status bars
 * - GestureHandlerRootView for gesture support
 * - AuthProvider for global auth state
 */
const _layout = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

/**
 * MainLayout handles:
 * - Listening for auth state changes from Supabase
 * - Setting global auth and user data context
 * - Navigating based on auth state
 * - Defining global stack screen options
 */
const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        upadteUserData(session?.user, session.user.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/Welcome");
      }
    });
  }, []);

  const upadteUserData = async (user, email) => {
    let res = await getUserData(user?.id);
    if (res.success) setUserData({ ...res?.data, email });
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
};

export default _layout;

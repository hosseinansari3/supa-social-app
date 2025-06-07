import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import { AuthProvider, useAuth } from "./contexts/authContext";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session user", session?.user);

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

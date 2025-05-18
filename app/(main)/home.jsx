import { Alert, Button, StyleSheet, Text } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/authContext";

const home = () => {
  const {user, setAuth } = useAuth();

  console.log("user", user)

  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("sign out", "error signing out");
    }
  };
  return (
    <ScreenWrapper>
      <Text>home</Text>
      <Button title="logout" onPress={onLogout} />
    </ScreenWrapper>
  );
};

export default home;

const styles = StyleSheet.create({});

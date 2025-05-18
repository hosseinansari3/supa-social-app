<<<<<<< HEAD
import { useRouter } from "expo-router";
import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "../../assets/icons";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/authContext";
import { hp, wp } from "../helpers/common";

const home = () => {
  const { setAuth } = useAuth();
  const router = useRouter();
=======
import { Alert, Button, StyleSheet, Text } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/authContext";

const home = () => {
  const {user, setAuth } = useAuth();

  console.log("user", user)
>>>>>>> 10977cbf392b8fa4858d05743d8cdb106fdd58b6

  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("sign out", "error signing out");
    }
  };
  return (
    <ScreenWrapper>
<<<<<<< HEAD
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>LinkUp</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("notifications")}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <Icon
                name="user"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
        </View>
      </View>
=======
      <Text>home</Text>
>>>>>>> 10977cbf392b8fa4858d05743d8cdb106fdd58b6
      <Button title="logout" onPress={onLogout} />
    </ScreenWrapper>
  );
};

export default home;

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal: wp(4)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
});
=======
const styles = StyleSheet.create({});
>>>>>>> 10977cbf392b8fa4858d05743d8cdb106fdd58b6

import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "../../assets/icons";
import Avatar from "../../components/Avatar";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../contexts/authContext";
import { hp, wp } from "../helpers/common";

const home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  // const onLogout = async () => {
  //   setAuth(null);
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     Alert.alert("sign out", "error signing out");
  //   }
  // };
  return (
    <ScreenWrapper>
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
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{}}
              />
            </Pressable>
          </View>
        </View>
      </View>
      {/* <Button title="logout" onPress={onLogout} /> */}
    </ScreenWrapper>
  );
};

export default home;

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

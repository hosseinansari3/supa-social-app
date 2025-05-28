import { StyleSheet, View } from "react-native";
import Avatar from "../../components/Avatar";
import Header from "../../components/Header";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../contexts/authContext";
import { hp } from "../helpers/common";

const NewPost = () => {
  const { user } = useAuth();
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create post" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {/* avatar */}

          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});

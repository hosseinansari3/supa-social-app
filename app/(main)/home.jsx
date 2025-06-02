import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "../../assets/icons";
import Avatar from "../../components/Avatar";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";
import { fetchPosts } from "../../services/postService";
import { getUserData } from "../../services/userService";
import { useAuth } from "../contexts/authContext";
import { hp, wp } from "../helpers/common";

var limit = 0;
const home = () => {
  const { user, setAuth } = useAuth();

  const router = useRouter();

  const [posts, setPosts] = useState([]);

  const handlePostEvent = async (payload) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };
  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    limit = limit + 10;
    let res = await fetchPosts();
    if (res.success) {
      setPosts(res.data);
    }
  };

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
        {/* posts */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          ListFooterComponent={
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
          }
        />
      </View>
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
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
});

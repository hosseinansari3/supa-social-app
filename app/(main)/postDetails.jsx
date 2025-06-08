import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import PostCard from "../../components/PostCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { createComment, fetchPostDetails } from "../../services/postService";
import { useAuth } from "../contexts/authContext";
import { hp, wp } from "../helpers/common";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  console.log("got post id", postId);
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    //feth post details
    let res = await fetchPostDetails(postId);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > 200) {
        translateY.value = withTiming(1000, { duration: 250 }, (finished) => {
          if (finished) runOnJS(router.back)();
        });
      } else {
        translateY.value = withSpring(0); // snap back
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ScreenWrapper>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              marginTop: 20,
              backgroundColor: "white",
              height: hp(100),
              borderRadius: theme.radius.md,
              width: wp(99),
              alignSelf: "center",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.06,
              shadowRadious: 6,
              elevation: 1,
            },
            animatedStyle,
          ]}
        >
          {startLoading ? (
            <View style={styles.center}>
              <Loading />
            </View>
          ) : (
            <ScrollView>
              <PostCard
                item={{
                  ...post,
                  comments: [{ count: post?.comments?.length }],
                }}
                currentUser={user}
                router={router}
                hasShadow={false}
                showMoreIcon={false}
              />

        </Animated.View>
      </GestureDetector>
    </ScreenWrapper>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  list: {
    paddingHorizontal: wp(4),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

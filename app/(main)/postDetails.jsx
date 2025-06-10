import { Icon } from "@rneui/themed";
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
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import CommentItem from "../../components/CommentItem";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";
import {
  createComment,
  fetchPostDetails,
  removeComment,
} from "../../services/postService";
import { getUserData } from "../../services/userService";
import { useAuth } from "../contexts/authContext";
import { hp, wp } from "../helpers/common";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  console.log("got post id", postId);
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setloading] = useState(false);

  const [startLoading, setStartLoading] = useState(true);
  const [post, setPost] = useState(null);
  const inputRef = useRef(null);
  const commentRef = useRef("");

  const [isTop, setIsTop] = useState(false);
  const [isScrolling, setScrolling] = useState(false);

  const handleNewComment = async (payload) => {
    console.log("got new commentt", payload.new);
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const getPostDetails = async () => {
    //feth post details
    let res = await fetchPostDetails(postId);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };

    setloading(true);
    let res = await createComment(data);
    setloading(false);
    if (res.success) {
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  const scrollRef = useRef(null);

  const scrollGesture = Gesture.Native().withRef(scrollRef);

  const translateY = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .manualActivation(isScrolling && !isTop)
    .onTouchesMove((e, gesture) => {
      // Example: only activate pan if the user has moved more than 10 pixels

      if (isScrolling) {
        if (isTop) {
          gesture.activate(); // Manually activate gesture
        } else {
          gesture.end();
        }
      }
      console.log("move");
    })
    .onUpdate((e) => {
      if (e.translationY >= 0) {
        translateY.value = e.translationY;
      } else {
        runOnJS(setIsTop)(false);
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

  const onDeleteComment = async (comment) => {
    let res = await removeComment(comment?.id);
    if (res.success) {
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id != comment.id
        );
        return updatedPost;
      });
    } else {
      Alert.alert("comment", res.msg);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    console.log("useEffectIsTOP", isTop);
  }, [isTop]);

  const composed = Gesture.Simultaneous(panGesture, scrollGesture);

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
              width: wp(100),
              padding: 10,
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
            <GestureDetector gesture={composed}>
              <ScrollView
                onScroll={(e) => {
                  setScrolling(true);
                  if (e.nativeEvent.contentOffset.y <= 0) {
                    setIsTop(true);
                  } else {
                    setIsTop(false);
                  }
                  console.log("ScrollPos", e.nativeEvent.contentOffset.y);
                  console.log("isTop", isTop);
                }}
              >
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

                {/* comment input */}

                <View style={styles.inputContainer}>
                  <Input
                    inputRef={inputRef}
                    onChangeText={(value) => (commentRef.current = value)}
                    placeholder="Tyoe your comment"
                    placeholderTextColor={theme.colors.textLight}
                    containerStyle={{
                      flex: 1,
                      height: hp(6.2),
                      borderRadius: theme.radius.xl,
                    }}
                  />
                  {loading ? (
                    <View style={styles.loading}>
                      <Loading size="small" />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.sendIcon}
                      onPress={onNewComment}
                    >
                      <Icon name="send" color={theme.colors.primaryDark} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* comment list */}

                <View style={{ marginVertical: 15, gap: 17 }}>
                  {post?.comments?.map((comment) => (
                    <CommentItem
                      key={comment?.id?.toString()}
                      item={comment}
                      canDelete={
                        user.id == comment.userId || user?.id == post?.userId
                      }
                      onDelete={onDeleteComment}
                    />
                  ))}

                  {post?.comments?.length == 0 && (
                    <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
                      Be first to comment!
                    </Text>
                  )}
                </View>
              </ScrollView>
            </GestureDetector>
          )}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Icon from "../../assets/icons";
import CommentItem from "../../components/CommentItem";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";
import { createNotification } from "../../services/notificationService";
import {
  createComment,
  fetchPostDetails,
  removeComment,
  removePost,
} from "../../services/postService";
import { getUserData } from "../../services/userService";
import { useAuth } from "../contexts/authContext";
import { hp, wp } from "../helpers/common";

const PostDetails = () => {
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  })); //animated style for modal

  const [loading, setloading] = useState(false); // for comment submission
  const [startLoading, setStartLoading] = useState(true); // for initial post fetch
  const [post, setPost] = useState(null); // post and comments data
  const [isTop, setIsTop] = useState(true); // to determine gesture activation
  const [isScrolling, setScrolling] = useState(false); // disable gesture when scrolling

  const inputRef = useRef(null); // ref to input field
  const commentRef = useRef(""); // track comment input without causing re-renders

  // Handle real-time comment insertion from Supabase
  const handleNewComment = async (payload) => {
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
    // Subscribe comment INSERT events to Supabase
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
      supabase.removeChannel(commentChannel); // cleanup on unmount
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
      // Notify post owner if commenter is someone else
      if (user.id != post.userId) {
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: "commented on your post",
          data: JSON.stringify({ postId: post.id, commentId: res?.data?.id }),
        };
        createNotification(notify);
      }
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  const translateY = useSharedValue(0); // control vertical drag
  const lastY = useSharedValue(0); // track drag start point

  // Pan gesture to close modal when dragged down from top
  const panGesture = Gesture.Pan()
    .manualActivation(!isScrolling && isTop) // allow gesture only if not scrolling and at top
    .onTouchesDown((e) => {
      const touch = e.allTouches[0];
      lastY.value = touch.absoluteY;
    })
    .onTouchesMove((e, gesture) => {
      const touch = e.allTouches[0];
      if (lastY.value !== null) {
        const deltaY = touch.absoluteY - lastY.value;

        if (deltaY > 0) {
          if (isTop) {
            gesture.activate(); // Manually activate gesture
          } else {
            gesture.end();
          }
        } else if (deltaY < 0) {
          gesture.end();
        }
      }
    })

    .onUpdate((e) => {
      if (e.translationY >= 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (translateY.value > 200) {
        translateY.value = withTiming(1000, { duration: 250 }, (finished) => {
          if (finished) runOnJS(router.back)(); // trigger back navigation
        });
      } else {
        translateY.value = withSpring(0); // // snap back if drag not far enough
      }
    });

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

  const onDeletePost = async () => {
    let res = await removePost(post.id);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("post", res.msg);
    }
  };

  const onEditePost = async (item) => {
    translateY.value = withTiming(1000, { duration: 250 }, (finished) => {
      // if (finished) runOnJS(router.back)();
    });
    router.back();
    router.push({ pathname: "newPost", params: { ...item } });
  };

  useEffect(() => {
    //pull down modal and go back on android hardware button press
    const backAction = () => {
      translateY.value = withTiming(1000, { duration: 350 }, (finished) => {
        if (finished) runOnJS(router.back)();
      });

      return true; // prevent default behavior (i.e., going back automatically)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // cleanup listener
  }, []);

  return (
    <ScreenWrapper>
      <SafeAreaView>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              { height: hp(100) },
              {
                marginTop: 20,
                paddingBottom: bottom + 90,
                backgroundColor: "white",
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
              <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={30}
                keyboardShouldPersistTaps={"handled"}
                showsVerticalScrollIndicator={false}
                onScroll={(e) => {
                  setScrolling(true);
                  if (e.nativeEvent.contentOffset.y <= 0) {
                    setIsTop(true);
                  } else {
                    setIsTop(false);
                  }
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
                  showDelete={true}
                  onDelete={onDeletePost}
                  onEdite={onEditePost}
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
                <View
                  style={{
                    marginVertical: 15,
                    gap: 17,
                  }}
                >
                  {post?.comments?.map((comment) => (
                    <CommentItem
                      key={comment?.id?.toString()}
                      item={comment}
                      highlight={comment.id == commentId}
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
              </KeyboardAwareScrollView>
            )}
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
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

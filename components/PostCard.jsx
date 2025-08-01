import { Video } from "expo-av";
import { Image } from "expo-image";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { hp, wp } from "../app/helpers/common";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";
import { getSupabaseFileUrl } from "../services/imageService";
import { createPostLike, removePostLike } from "../services/postService";
import Avatar from "./Avatar";

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyle = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const shadowStyles = {
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.06,
  shadowRadious: 6,
  elevation: 1,
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdite = () => {},
}) => {
  const [likes, setLikes] = useState([]);

  // Format post creation date
  const createdAt = moment(item?.created_at).format("MMM D");

  // Determine if current user has liked the post
  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  useEffect(() => {
    // Set initial likes from post data
    setLikes(item?.postLikes);
  }, []);

  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({ pathname: "postDetails", params: { postId: item?.id } });
  };

  const onLike = async () => {
    // Toggle like/unlike and sync with backend
    if (liked) {
      let updatedLikes = likes.filter((like) => like.userId != currentUser?.id);
      setLikes([...updatedLikes]);

      let res = await removePostLike(item?.id, currentUser?.id);
      if (!res.success) {
        Alert.alert("Post", "something went wrong");
      }
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);

      let res = await createPostLike(data);
      if (!res.success) {
        Alert.alert("Post", "something went wrong");
      }
    }
  };

  const handlePostDelete = () => {
    // Confirm before deleting post
    Alert.alert("Confirm", "are you sure you want to Delete the post?", [
      {
        text: "Cancel",
        onPress: () => console.log("modal cancelled"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>

        {/* Show options if enabled */}
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.4)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        {/* Show edit/delete buttons if allowed */}
        {showDelete && currentUser?.id == item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdite(item)}>
              <Icon name="edite" size={hp(2.5)} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
              <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* post body and media */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHTML
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyle}
            />
          )}
        </View>

        {/* post image */}
        {item?.file && item?.file?.includes("postImages") && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}

        {/* post video */}
        {item?.file && item?.file?.includes("postVideos") && (
          <Video
            style={[styles.postMedia, { height: hp(30) }]}
            source={getSupabaseFileUrl(item?.file)}
            useNativeControls
            isLooping
            resizeMode="cover"
          />
        )}
      </View>

      {/* like, comment and share */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={24}
              fill={liked ? theme.colors.rose : "transparent"}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments[0]?.count}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon name="share" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>0</Text>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
    // marginBottom: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});

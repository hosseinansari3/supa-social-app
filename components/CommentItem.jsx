import moment from "moment";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp } from "../app/helpers/common";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";
import { fetchCommentDetails } from "../services/postService";
import Avatar from "./Avatar";

const CommentItem = ({
  item,
  canDelete = false, // Controls visibility of delete icon
  onDelete = () => {},
  handleAiIconPress = () => {},
  highlight = false, //  Apply visual emphasis (e.g., when comment is focused)
}) => {
  const [commentReplies, setCommentReplies] = useState([]);

  // Format comment date to readable short form
  const createdAt = moment(item?.created_at).format("MMM d");

  const handelDelete = () => {
    //  Confirm comment deletion with modal
    Alert.alert("Confirm", "are you sure you want to Delete the comment?", [
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

  const fetchComment = async () => {
    const res = await fetchCommentDetails(item?.id);
    console.log("commentDetails", res.data.comment_replies);
    setCommentReplies(res.data.comment_replies);
  };

  useEffect(() => {
    fetchComment();
  }, []);

  return (
    <View style={styles.container}>
      {/*  User avatar */}
      <Avatar uri={item?.user?.image} />

      {/*  Comment card */}
      <View style={[styles.content, highlight && styles.highlight]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Username and date */}
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.user?.name}</Text>
            <Text>.</Text>
            <Text style={[styles.text, { color: theme.colors.textLight }]}>
              {createdAt}
            </Text>
          </View>

          <View style={styles.icons}>
          {/* Conditionally show delete button if user has permission */}
          {canDelete && (
            <TouchableOpacity onPress={handelDelete}>
              <Icon name="delete" size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          )}

            {/* ai reply button */}
            <TouchableOpacity
              onPress={() => handleAiIconPress(item?.text, item?.id)}
            >
              <Icon name="ai" size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Comment text */}
        <Text style={[styles.text, { fontWeight: "normal" }]}>
          {item?.text}
        </Text>
        {commentReplies.length > 0 && (
          <View
            style={{
              padding: 5,
              marginLeft: 14,
              backgroundColor: "#ffff",
              borderRadius: theme.radius.md,
            }}
          >
            {commentReplies?.map((reply) => (
              <View style={{ marginBottom: 10 }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Avatar uri={reply?.user?.image} size={hp(4)} />
                  <View style={{ flexShrink: 1 }}>
                    <Text style={{ fontSize: 13 }}>{reply?.user?.name}</Text>
                    <Text style={{ fontSize: 13, flexWrap: "wrap" }}>
                      {reply?.text}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },
  content: {
    backgroundColor: "rgba(0,0,0,0.06)",
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  highlight: {
    borderWidth: 0.2,
    backgroundColor: "white",
    borderColor: theme.colors.dark,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },
  icons: {
    display: "flex",
    flexDirection: "row",
  },
});

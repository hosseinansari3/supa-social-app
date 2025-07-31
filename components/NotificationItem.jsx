import moment from "moment/moment";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp } from "../app/helpers/common";
import { theme } from "../constants/theme";
import Avatar from "./Avatar";

const NotificationItem = ({ item, router }) => {
  const handleClick = () => {
    //  Parse data to extract post and comment IDs, then navigate to post details
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "postDetails", params: { postId, commentId } });
  };

  //  Format creation date to "Month Day" (e.g., "Jul 30")
  const createAt = moment(item?.created_at).format("MMM d");

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      {/* sender's avatar */}
      <Avatar uri={item?.sender?.image} size={hp(5)} />

      {/* sender name and notification title */}
      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>
          {item?.title}
        </Text>
      </View>

      {/*  formatted creation date */}
      <Text style={[styles.text, { color: theme.colors.textLight }]}>
        {createAt}
      </Text>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    // paddingVerti&al: 12,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  nameTitle: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
});

import moment from "moment/moment";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp } from "../app/helpers/common";
import { theme } from "../constants/theme";
import Avatar from "./Avatar";

const NotificationItem = ({ item, router }) => {
  const handleClick = () => {
    // open post details
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "postDetails", params: { postId, commentId } });
  };

  const createAt = moment(item?.created_at).format("MMM d");
  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <Avatar uri={item?.sender?.image} size={hp(5)} />
      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>
          {item?.title}
        </Text>
      </View>
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

import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { hp } from "../app/helpers/common";
import { theme } from "../constants/theme";

const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {},
}) => {
  return (
    <Image
      source={{ uri }}
      transition={100}
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: rounded, style },
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});

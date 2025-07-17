import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, bg }) => {
  const { top, bottom } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  return (
    <View
      style={{
        flex: 1,
        paddingTop,
        paddingBottom: bottom,
        backgroundColor: bg,
      }}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;

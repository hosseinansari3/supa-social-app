import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// A reusable wrapper component that applies safe area padding and background color
// Props:
// - children: React nodes to render inside the wrapper
// - bg: background color of the screen
const ScreenWrapper = ({ children, bg }) => {
  // Retrieve device-specific safe area insets (e.g., for notches, status bar, bottom nav)

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

import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { hp, wp } from "../helpers/common";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  console.log("got post id", postId);

  const router = useRouter();

  const translateY = useSharedValue(0);

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
          <Text>postDetails</Text>
        </Animated.View>
      </GestureDetector>
    </ScreenWrapper>
  );
};

export default PostDetails;

const styles = StyleSheet.create({});

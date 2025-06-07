import { useLocalSearchParams, useRouter } from "expo-router";
const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  console.log("got post id", postId);
  return (
    <ScreenWrapper>
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
    </ScreenWrapper>
  );
};

export default PostDetails;

const styles = StyleSheet.create({});

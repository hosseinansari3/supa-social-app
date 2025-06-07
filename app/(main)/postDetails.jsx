import { useLocalSearchParams, useRouter } from "expo-router";
const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  console.log("got post id", postId);
  return (
    <ScreenWrapper>
    </ScreenWrapper>
  );
};

export default PostDetails;

const styles = StyleSheet.create({});

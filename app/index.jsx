import { router } from "expo-router";
import { Button, Text } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";

const index = () => {
  return (
    <ScreenWrapper>
      <Text>index</Text>
      <Button title="wellcome" onPress={() => router.push("Welcome")} />
    </ScreenWrapper>
  );
};

export default index;

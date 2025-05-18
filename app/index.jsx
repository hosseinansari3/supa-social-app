import { View } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import Loading from "../components/Loading";

const index = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Loading />
    </View>
  );
};

export default index;

import { StyleSheet, Text } from "react-native";
import Back from "./Back";
import Heart from "./Heart";
import Home from "./Home";
import Lock from "./Lock";
import Logout from "./Logout";
import Mail from "./Mail";
import Plus from "./Plus";
import User from "./User";

const icons = {
  home: Home,
  back: Back,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  plus: Plus,
};

const Icon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  return (
    <Text>
      <IconComponent
        height={props.size || 24}
        width={props.size || 24}
        strokeWidth={props.strokeWidth || 1.9}
        {...props}
      />
    </Text>
  );
};

export default Icon;

const styles = StyleSheet.create({});

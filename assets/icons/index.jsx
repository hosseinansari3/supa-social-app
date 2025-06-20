import { StyleSheet, Text } from "react-native";
import Back from "./Back";
import Call from "./Call";
import Camera from "./Camera";
import Comment from "./Comment";
import Delete from "./Delete";
import Edite from "./Edite";
import Heart from "./Heart";
import Home from "./Home";
import Image from "./Image";
import Location from "./Location";
import Lock from "./Lock";
import Logout from "./Logout";
import Mail from "./Mail";
import Plus from "./Plus";
import Send from "./Send";
import Share from "./Share";
import ThreeDotsHorizontal from "./ThreeDotsHorizontal";
import User from "./User";
import Video from "./Video";

const icons = {
  home: Home,
  back: Back,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  plus: Plus,
  logout: Logout,
  edite: Edite,
  call: Call,
  camera: Camera,
  location: Location,
  image: Image,
  video: Video,
  delete: Delete,
  threeDotsHorizontal: ThreeDotsHorizontal,
  comment: Comment,
  share: Share,
  send: Send,
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

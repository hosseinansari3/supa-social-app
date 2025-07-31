import { Dimensions } from "react-native";

// Destructure device width and height from screen dimensions once at module load
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

// Convert height percentage to pixels based on current device height
export const hp = (percentage) => {
  return (percentage * deviceHeight) / 100;
};

// Convert width percentage to pixels based on current device width
export const wp = (percentage) => {
  return (percentage * deviceWidth) / 100;
};

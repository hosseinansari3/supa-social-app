import Svg, { G, Path } from "react-native-svg";

const Location = (props) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
    <G
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></G>
    <G id="SVGRepo_iconCarrier">
      <Path
        d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></Path>
      <Path
        d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></Path>
    </G>
  </Svg>
);

export default Location;

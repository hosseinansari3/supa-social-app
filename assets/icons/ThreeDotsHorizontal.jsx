import Svg, { G, Path } from "react-native-svg";

const ThreeDotsHorizontal = (props) => (
  <Svg
    fill="#000000"
    height="200px"
    width="200px"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 16 16"
    {...props}
  >
    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
    <G
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></G>
    <G id="SVGRepo_iconCarrier">
      <Path
        class="cls-1"
        d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z"
      ></Path>
    </G>
  </Svg>
);

export default ThreeDotsHorizontal;

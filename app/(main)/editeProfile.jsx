// External imports from libraries
import * as ImagePicker from "expo-image-picker"; // Import image picker for media library access
import { useRouter } from "expo-router"; // For navigation
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Project assets and components
import Icon from "../../assets/icons";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { getUserImageSrc, uploadFile } from "../../services/imageService";
import { updateUser } from "../../services/userService";
import { useAuth } from "../contexts/authContext";
import { hp, wp } from "../helpers/common";

const EditeProfile = () => {
  const { user: currentUser, setUserData } = useAuth();
  const router = useRouter();

  // Initialize local user state with default values
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    image: "",
    bio: "",
    address: "",
  });

  const [loading, setLoading] = useState(false); // Track loading state during form submission

  useEffect(() => {
    // Populate user state with current user data from context
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || null,
        address: currentUser.address || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  // Handles image selection from device library
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Update user state with the selected image
      setUser({ ...user, image: result.assets[0] });
    }
  };

  // Validate inputs and submit updated profile data
  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, image, bio } = userData;

    // Frontend validation: ensure all required fields are filled
    if (!name || !phoneNumber || !address || !bio || !image) {
      Alert.alert("profile", "please fill all the fields");
      return;
    }

    setLoading(true); // Start loading

    // If the image is a new local file, upload it first
    if (typeof image == "object") {
      let imageRes = await uploadFile("profiles", image?.uri, true);
      if (imageRes.success)
        userData.image = imageRes.data; // Replace with uploaded image URL
      else userData.image = null; // Clear image on failure to prevent broken URLs
    }

    // Call service to update user in backend
    const res = await updateUser(currentUser?.id, userData);
    setLoading(false); // Stop loading regardless of success/failure

    if (res.success) {
      // Update user context and go back
      setUserData({ ...currentUser, ...userData });
      router.back();
    }
    // Consider handling errors (e.g., showing Alert on failure)
  };

  // Determine correct image source for <Image> component
  let imageSource =
    user.image && typeof user.image == "object"
      ? { uri: user.image.uri }
      : getUserImageSrc(user.image);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edite Profile" />

          {/* Profile form section */}

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>

            {/* Name input */}
            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />

            {/* Phone input */}
            <Input
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />

            {/* Address input */}
            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your location"
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />

            {/* Bio input */}
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />

            {/* Submit button */}
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditeProfile;

// Style definitions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4), // Responsive padding
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center", // Center avatar in parent view
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },

  form: {
    gap: 18,
    marginTop: 20,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});

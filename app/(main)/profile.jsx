import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../contexts/authContext";

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <Text>profile</Text>
    </ScreenWrapper>
  );
};

const userHeader = ({ user, router }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View>
        <Header title="profile" showBackButton={true} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" />
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});

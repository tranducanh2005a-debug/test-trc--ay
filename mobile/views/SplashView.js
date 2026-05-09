import { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { getData } from "../utils/storage";

export default function SplashView({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      checkLogin();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const checkLogin = async () => {
    try {
      const token = await getData("token");

      if (token) {
        navigation.replace("Main");
      } else {
        navigation.replace("Login");
      }
    } catch (err) {
      navigation.replace("Login");
    }
  };

  return (
    <View style={styles.container}>
      
      {/* LOGO */}
      <View style={styles.logoBox}>
        <Text style={styles.logo}>ATH</Text>
        <Text style={styles.sub}>Fashion Store</Text>
      </View>

      {/* LOADING */}
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6b3e26",
    justifyContent: "center",
    alignItems: "center",
  },

  logoBox: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 3,
  },

  sub: {
    color: "#ddd",
    marginTop: 5,
    fontSize: 12,
  },

  loading: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },

  loadingText: {
    color: "#fff",
    marginTop: 5,
    fontSize: 12,
  },
});
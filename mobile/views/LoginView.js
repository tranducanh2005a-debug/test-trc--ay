import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { login } from "../services/authService";
import { saveData } from "../utils/storage";

export default function LoginView({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ");
        return;
      }

      const res = await login({ email, password });
      console.log("LOGIN RESPONSE:", res.data);

      const { accessToken, user, refreshToken } = res.data;

      console.log("ACCESS:", accessToken);
      console.log("REFRESH:", refreshToken);

      await saveData("token", accessToken);
      await saveData("user", user);
      await saveData("refreshToken", refreshToken);

      Alert.alert("Thành công", "Đăng nhập OK");

      //phân quyền (có thể mở rộng sau)
      if (user.role === "admin") {
        navigation.replace("Main"); // sau này có thể đổi AdminScreen
      } else {
        navigation.replace("Main");
      }

    } catch (err) {
      console.log(err?.response?.data || err.message);

      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Sai tài khoản hoặc server lỗi"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>ATH</Text>
      </View>

      {/* TITLE */}
      <Text style={styles.title}>Chào mừng trở lại</Text>
      <Text style={styles.subtitle}>
        Khám phá bộ sưu tập mới nhất từ ATH
      </Text>

      {/* CARD */}
      <View style={styles.card}>
        <Text>Email</Text>
        <TextInput
          placeholder="ten@email.com"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text>Mật khẩu</Text>
        <TextInput
          placeholder="******"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {/* BUTTON */}
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Đăng nhập</Text>
        </TouchableOpacity>

        {/* SOCIAL */}
        <Text style={styles.or}>Hoặc đăng nhập với</Text>

        <View style={styles.social}>
          <View style={styles.socialBtn}>
            <Text>Google</Text>
          </View>
          <View style={styles.socialBtn}>
            <Text>Apple</Text>
          </View>
        </View>

        {/* REGISTER */}
        <Text style={styles.register}>
          Bạn chưa có tài khoản?{" "}
          <Text
            style={{ color: "#8B4513", fontWeight: "bold" }}
            onPress={() => navigation.navigate("Register")}
          >
            Đăng ký ngay
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },

  logoBox: {
    borderWidth: 2,
    borderColor: "#2196F3",
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  logoText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },

  btn: {
    backgroundColor: "#5A2D0C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  or: {
    textAlign: "center",
    marginVertical: 15,
    color: "gray",
  },

  social: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  socialBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },

  register: {
    textAlign: "center",
    marginTop: 15,
  },
});
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { register } from "../services/authService";

export default function RegisterView({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }

    try {
      await register({
        name,
        email,
        phone,
        password,
        role: "user",
      });

      Alert.alert("OK", "Đăng ký thành công");
      navigation.navigate("Login");
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi", "Email đã tồn tại hoặc server lỗi");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.logo}>ATH</Text>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Tạo tài khoản mới</Text>
        <Text style={styles.subtitle}>
          Khám phá thế giới thời trang đẳng cấp cùng ATH
        </Text>

        {/* INPUT */}
        <Text style={styles.label}>HỌ VÀ TÊN</Text>
        <TextInput
          placeholder="Nguyễn Văn A"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          placeholder="example@email.com"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>SỐ ĐIỆN THOẠI</Text>
        <TextInput
          placeholder="09xx xxx xxx"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>MẬT KHẨU</Text>
        <TextInput
          placeholder="******"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>XÁC NHẬN MẬT KHẨU</Text>
        <TextInput
          placeholder="******"
          secureTextEntry
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
        />

        {/* BUTTON */}
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Đăng ký</Text>
        </TouchableOpacity>

        {/* LOGIN */}
        <Text style={styles.login}>
          Đã có tài khoản?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            Đăng nhập
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
    justifyContent: "center",
    padding: 20,
  },

  logo: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 15,
  },

  label: {
    fontSize: 12,
    color: "gray",
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },

  btn: {
    backgroundColor: "#5A2D0C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  login: {
    textAlign: "center",
    marginTop: 15,
  },

  loginLink: {
    color: "#8B4513",
    fontWeight: "bold",
  },
});
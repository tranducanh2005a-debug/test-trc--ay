import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "../services/authService";

export default function EditProfileView({ navigation, route }) {
  const user = route.params?.user;

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);

  // ===== CHỌN ẢNH =====
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // ===== LƯU =====
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên");
      return;
    }

    try {
      await updateProfile({
        name,
        avatar,
      });

      Alert.alert("Thành công 🎉", "Cập nhật thành công!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
      Alert.alert("Lỗi", "Không thể cập nhật");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>

      {/* AVATAR */}
      <TouchableOpacity style={styles.avatarBox} onPress={pickImage}>
        <Image
          source={{
            uri: avatar || "https://i.pravatar.cc/100",
          }}
          style={styles.avatar}
        />
        <Text style={styles.changeText}>Đổi ảnh</Text>
      </TouchableOpacity>

      {/* NAME */}
      <Text style={styles.label}>Tên</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Nhập tên"
      />

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  avatarBox: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  changeText: {
    marginTop: 5,
    color: "#8B4513",
  },

  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#8B4513",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
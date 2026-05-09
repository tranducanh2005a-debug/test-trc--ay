import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function OrderSuccessScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color="green" />

      <Text style={styles.title}>Đặt hàng thành công!</Text>

      <Text style={styles.sub}>
        Cảm ơn bạn đã mua hàng 🎉
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.btnText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },

  sub: {
    color: "gray",
    marginVertical: 10,
  },

  btn: {
    marginTop: 20,
    backgroundColor: "#8B4513",
    padding: 15,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
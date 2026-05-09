import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { removeData } from "../utils/storage";
import { getMe } from "../services/authService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileView({ navigation }) {
  const [user, setUser] = useState(null);

  // reload khi quay lại màn
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const res = await getMe();
          setUser(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      loadUser();
    }, [])
  );

  const handleLogout = async () => {
    await removeData("token");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} />
          </TouchableOpacity>

          <Ionicons name="settings-outline" size={20} />
        </View>

        {/* USER CARD */}
        <View style={styles.card}>
          <Image
            source={{
              uri: user?.avatar
                ? `${user.avatar}?time=${new Date().getTime()}`
                : "https://i.pravatar.cc/100",
            }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {user?.name || "Loading..."}
            </Text>
            <Text style={styles.email}>
              {user?.email || ""}
            </Text>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                navigation.navigate("EditProfile", { user })
              }
            >
              <Text style={styles.editText}>
                Chỉnh sửa thông tin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ORDER */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>
              Đơn hàng của tôi
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("OrderHistory")
              }
            >
              <Text style={styles.link}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orderRow}>
            {[
              { icon: "time-outline", label: "Chờ thanh toán" },
              { icon: "cube-outline", label: "Đang xử lý" },
              { icon: "car-outline", label: "Đang giao" },
              { icon: "star-outline", label: "Đánh giá" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.orderItem}
                onPress={() =>
                  navigation.navigate("OrderHistory")
                }
              >
                <Ionicons name={item.icon} size={22} />
                <Text style={styles.orderText}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          {menu.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={18} />
                <Text style={styles.menuText}>
                  {item.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="gray"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logout}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} />
          <Text style={{ marginLeft: 5 }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
const menu = [
  { icon: "heart-outline", label: "Danh sách yêu thích" },
  { icon: "ticket-outline", label: "Voucher của tôi" },
  { icon: "location-outline", label: "Địa chỉ nhận hàng" },
  { icon: "card-outline", label: "Phương thức thanh toán" },
  { icon: "settings-outline", label: "Cài đặt tài khoản" },
  { icon: "help-circle-outline", label: "Trung tâm trợ giúp" },
];

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  headerTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#6b3e26",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  email: {
    color: "#ddd",
    fontSize: 12,
  },

  editBtn: {
    marginTop: 5,
    backgroundColor: "#8B4513",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  editText: {
    color: "#fff",
    fontSize: 12,
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },

  sectionTitle: {
    fontWeight: "bold",
  },

  link: {
    fontSize: 12,
    color: "#8B4513",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderItem: {
    alignItems: "center",
  },

  orderText: {
    fontSize: 11,
    marginTop: 5,
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 10,
  },

  logout: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});
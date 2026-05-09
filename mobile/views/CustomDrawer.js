import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

export default function CustomDrawer({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const toggle = (id) => {
    setOpen({ ...open, [id]: !open[id] });
  };

  const goCategory = (id) => {
    navigation.closeDrawer();
    navigation.navigate("Home", { categoryId: id });
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>ATH Fashion Menu</Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close" size={22} />
        </TouchableOpacity>
      </View>

      {/* NEW */}
      <TouchableOpacity style={styles.newItem}>
        <Text>🔥 Sản phẩm mới</Text>
      </TouchableOpacity>

      {/* CATEGORY LIST */}
      {categories.map((cat) => (
        <View key={cat.id}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => toggle(cat.id)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={{ uri: cat.image }} style={styles.icon} />
              <Text style={styles.text}>{cat.name}</Text>
            </View>

            <Ionicons name="chevron-down" size={16} />
          </TouchableOpacity>

          {/* SUB (fake demo hoặc bạn load từ API khác) */}
          {open[cat.id] && (
            <View style={styles.sub}>
              <TouchableOpacity onPress={() => goCategory(cat.id)}>
                <Text style={styles.subText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {/* SALE */}
      <Text style={styles.sale}>Giảm giá</Text>

      {/* BANNER */}
      <Image
        source={{
          uri: "https://i.imgur.com/0y8Ftya.jpg",
        }}
        style={styles.banner}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
  },

  newItem: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  text: {
    marginLeft: 10,
    fontSize: 15,
  },

  sub: {
    paddingLeft: 35,
  },

  subText: {
    color: "#777",
    paddingVertical: 5,
  },

  icon: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },

  sale: {
    color: "red",
    marginTop: 10,
  },

  banner: {
    marginTop: 20,
    height: 140,
    borderRadius: 12,
  },
});
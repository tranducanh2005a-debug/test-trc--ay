import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { getCategories } from "../services/categoryService";

export default function CustomDrawer({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState({});
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.log("Lỗi load categories:", err);
    }
  };

  const toggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

 const goCategory = (id) => {
  navigation.closeDrawer();

  navigation.navigate("Main", {
    screen: "HomeDrawer",
    params: {
      screen: "Home",
      params: {
        categoryId: id,
      },
    },
  });
};

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>ATH Fashion Menu</Text>
          <Ionicons
            name="close"
            size={22}
            onPress={() => navigation.closeDrawer()}
          />
        </View>

        {/* NEW */}
        <TouchableOpacity style={styles.newBox}>
          <Text>🔥 Sản phẩm mới</Text>
        </TouchableOpacity>

        {/* CATEGORY */}
        {categories.map((item) => (
          <View key={item.id}>
            {/* PARENT */}
            <TouchableOpacity
              style={styles.item}
              onPress={() => toggle(item.id)}
            >
              <Text style={styles.text}>{item.name}</Text>
              <Ionicons
                name={open[item.id] ? "chevron-up" : "chevron-down"}
                size={16}
              />
            </TouchableOpacity>

            {/* CHILDREN */}
            {open[item.id] && (
              <View style={styles.sub}>
                {item.children && item.children.length > 0 ? (
                  item.children.map((sub) => (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => goCategory(sub.id)}
                    >
                      <Text style={styles.subText}>{sub.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.subText}>Không có danh mục con</Text>
                )}
              </View>
            )}
          </View>
        ))}

        {/* SALE */}
        <Text style={styles.sale}>Giảm giá</Text>

        {/* BANNER */}
        <Image
          source={{
            uri: "http://192.168.1.12:5000/images/bosuutapbanner.jpg",
          }}
          style={styles.banner}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
  },

  newBox: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  text: {
    fontSize: 15,
  },

  sub: {
    paddingLeft: 15,
    paddingBottom: 5,
  },

  subText: {
    color: "#777",
    paddingVertical: 6,
  },

  sale: {
    color: "red",
    marginTop: 15,
    fontWeight: "bold",
  },

  banner: {
    height: 140,
    borderRadius: 12,
    marginTop: 20,
  },
});
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

export default function HomeView({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const insets = useSafeAreaInsets();

  const categoryFromDrawer = route.params?.categoryId;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryFromDrawer) {
      setSelectedCategory(categoryFromDrawer);
      loadProducts(categoryFromDrawer);
    } else {
      loadProducts();
    }
  }, [categoryFromDrawer]);

  const loadProducts = async (categoryId = null) => {
    try {
      const res = await getProducts(categoryId);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1}}>
      
      {/* 🔥 HEADER (đứng yên) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} />
        </TouchableOpacity>

        <Text style={styles.logo}>ATH</Text>

        <Ionicons
          name="bag-outline"
          size={22}
          color="#8B4513"
          onPress={() => navigation.navigate("Cart")}
        />
      </View>

      {/* 🔥 SCROLL */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* SEARCH */}
        <TouchableOpacity
          style={styles.searchBox}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search" size={18} color="gray" />
          <Text style={styles.placeholder}>Tìm kiếm sản phẩm...</Text>
          <Ionicons name="options-outline" size={18} color="gray" />
        </TouchableOpacity>

        {/* BANNER */}
        <View style={styles.banner}>
          <Image
            source={{
              uri: "http://192.168.1.12:5000/images/bosuutapbanner.jpg",
            }}
            style={styles.bannerImg}
          />

          <View style={styles.bannerOverlay}>
            <Text style={styles.badge}>PHIÊN BẢN GIỚI HẠN</Text>
            <Text style={styles.bannerTitle}>BỘ SƯU TẬP MÙA MỚI</Text>

            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Mua Ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Lựa chọn của bạn</Text>

          <Text
            style={styles.more}
            onPress={() => {
              setSelectedCategory(null);
              loadProducts();
            }}
          >
            Xem tất cả
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryRow}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === item.id && styles.activeCategory,
                ]}
                onPress={() => {
                  setSelectedCategory(item.id);
                  loadProducts(item.id);
                }}
              >
                <Image source={{ uri: item.image }} style={styles.categoryImg} />
                <Text style={{ marginTop: 5 }}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* TREND */}
        <Text style={styles.sectionTitle}>Xu hướng hiện nay</Text>

        {products.length > 0 && (
          <View style={styles.productBig}>
            <Image
              source={{ uri: products[0].image }}
              style={styles.productImg}
            />

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{products[0].name}</Text>
              <Text style={styles.price}>
                {products[0].price.toLocaleString()}đ
              </Text>

              <TouchableOpacity style={styles.quickBtn}>
                <Text>Thêm nhanh</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* GRID */}
        <View style={styles.grid}>
          {products.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate("Detail", { product: item })}
            >
              <Image source={{ uri: item.image }} style={styles.cardImg} />
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString()}đ
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            ST SANG TRỌNG BỀN VỮNG GIAO ĐẾN BẠN.
          </Text>

          <TextInput
            placeholder="Địa chỉ Email của bạn"
            style={styles.email}
          />

          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>THAM GIA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    zIndex: 10,
  },

  logo: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#8B4513",
    letterSpacing: 2,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: "space-between",
  },

  placeholder: {
    flex: 1,
    marginLeft: 10,
    color: "gray",
  },

  banner: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },

  bannerImg: {
    width: "100%",
    height: 200,
  },

  bannerOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },

  badge: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 10,
  },

  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },

  btn: {
    backgroundColor: "#8B4513",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },

  more: {
    color: "gray",
  },

  categoryRow: {
    flexDirection: "row",
    gap: 15,
  },

  categoryItem: {
    alignItems: "center",
  },

  categoryImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  productBig: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },

  productImg: {
    width: "100%",
    height: 200,
  },

  productInfo: {
    padding: 10,
  },

  productName: {
    fontWeight: "bold",
  },

  price: {
    color: "#8B4513",
    fontWeight: "bold",
    marginVertical: 5,
  },

  quickBtn: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  cardImg: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },

  cardName: {
    marginTop: 5,
  },

  footer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginVertical: 20,
  },

  footerTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },

  email: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },

  activeCategory: {
    borderWidth: 2,
    borderColor: "#8B4513",
    borderRadius: 10,
  },
});
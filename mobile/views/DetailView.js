import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addToCart } from "../services/cartService";

export default function DetailView({ route, navigation }) {
  const product = route?.params?.product;

  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không có dữ liệu sản phẩm</Text>
      </View>
    );
  }

  const handleAdd = async () => {
    if (!selectedSize) {
      alert("Vui lòng chọn size");
      return;
    }

    try {
      await addToCart(product.id, selectedSize);
      alert("Đã thêm vào giỏ hàng");
    } catch (err) {
      alert("Có lỗi xảy ra");
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* IMAGE */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.mainImage} />

          {/* BACK */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} />
          </TouchableOpacity>
        </View>

        {/* INFO */}
        <View style={styles.info}>
          <Text style={styles.title}>{product.name}</Text>

          <Text style={styles.price}>
            {product.price.toLocaleString()}đ
          </Text>

          <Text style={styles.desc}>
            {product.description ||
              "Thiết kế tối giản, chất liệu cao cấp, phù hợp mọi phong cách."}
          </Text>
        </View>

        {/* SIZE */}
        <View style={styles.sizeBox}>
          <Text style={styles.label}>Kích thước</Text>

          <View style={styles.sizeRow}>
            {["S", "M", "L", "XL"].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeBtn,
                  selectedSize === size && styles.sizeActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={{
                    color: selectedSize === size ? "#fff" : "#000",
                  }}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* COMPLETE LOOK */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complete the look</Text>

          <View style={styles.lookRow}>
            {[1, 2].map((i) => (
              <View key={i} style={styles.lookItem}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.lookImg}
                />
                <Text>Item {i}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAdd}>
          <Text style={styles.cartText}>ADD TO CART →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },

  mainImage: {
    width: "100%",
    height: 450, 
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },

  info: {
    padding: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  price: {
    fontSize: 16,
    color: "#8B4513",
    marginVertical: 5,
  },

  desc: {
    color: "gray",
  },

  sizeBox: {
    padding: 15,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  sizeRow: {
    flexDirection: "row",
    gap: 10,
  },

  sizeBtn: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },

  sizeActive: {
    backgroundColor: "#000",
  },

  section: {
    padding: 15,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  lookRow: {
    flexDirection: "row",
    gap: 10,
  },

  lookItem: {
    width: 120,
  },

  lookImg: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },

  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  cartBtn: {
    backgroundColor: "#8B4513",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  cartText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
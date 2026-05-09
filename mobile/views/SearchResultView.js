import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getProducts } from "../services/productService";

export default function SearchResultView({ navigation }) {
  const route = useRoute();
  const keyword = route.params?.keyword;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (keyword) loadProducts();
  }, [keyword]);

  const loadProducts = async () => {
    try {
      const res = await getProducts(null, keyword);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết quả cho: "{keyword}"</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("Detail", { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.img} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString()}đ
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {products.length === 0 && (
        <Text>Không tìm thấy sản phẩm</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  item: {
    flexDirection: "row",
    marginBottom: 15,
  },

  img: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },

  name: {
    fontWeight: "bold",
  },

  price: {
    color: "#8B4513",
    marginTop: 5,
  },
});
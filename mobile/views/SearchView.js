import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts } from "../services/productService";

export default function SearchView({ navigation }) {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [suggestProducts, setSuggestProducts] = useState([]);

  useEffect(() => {
    loadHistory();
    loadSuggestProducts();
    setSearch("");
  }, []);

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("history");
    if (data) setHistory(JSON.parse(data));
  };

  const saveHistory = async (text) => {
    const newHistory = [text, ...history.filter((i) => i !== text)].slice(0, 5);
    setHistory(newHistory);
    await AsyncStorage.setItem("history", JSON.stringify(newHistory));
  };

  const loadSuggestProducts = async () => {
    try {
      const res = await getProducts();
      const shuffled = res.data.sort(() => 0.5 - Math.random());
      setSuggestProducts(shuffled.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) return;

    saveHistory(search);

    navigation.navigate("SearchResult", {
      keyword: search,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* 🔥 HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#8B4513" />
          </TouchableOpacity>

          <Text style={styles.logo}>ATH</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="bag-outline" size={22} color="#8B4513" />
          </TouchableOpacity>
        </View>

        {/* SEARCH BOX */}
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={18}
            color="gray"
            onPress={handleSearch}
          />

          <TextInput
            placeholder="Bạn đang tìm kiếm gì hôm nay?"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            style={{ flex: 1, marginLeft: 10 }}
            autoFocus
          />

          <Ionicons name="options-outline" size={18} color="gray" />
        </View>

        {search ? (
          <Text style={{ color: "gray", marginBottom: 10 }}>
            Nhấn Enter để tìm "{search}"
          </Text>
        ) : null}

        {!search && (
          <>
            {/* HISTORY */}
            <View style={styles.sectionRow}>
              <Text style={styles.title}>LỊCH SỬ TÌM KIẾM</Text>

              <Text style={styles.clear} onPress={() => setHistory([])}>
                Xóa tất cả
              </Text>
            </View>

            <View style={styles.row}>
              {history.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => {
                    saveHistory(item);
                    navigation.navigate("SearchResult", {
                      keyword: item,
                    });
                  }}
                >
                  <Ionicons name="time-outline" size={14} />
                  <Text style={{ marginLeft: 5 }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* TREND */}
            <Text style={styles.title}>XU HƯỚNG HIỆN NAY</Text>

            <View style={styles.trendRow}>
              <View style={styles.trendBig}>
                <Text style={{ color: "#fff" }}>SƯU TẬP</Text>
                <Text style={styles.trendTitle}>Vải Lụa Cao Cấp</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.trendSmall}>
                  <Text>Minimalist</Text>
                </View>

                <View style={styles.trendSmall}>
                  <Text>Streetwear</Text>
                </View>
              </View>
            </View>

            {/* SUGGEST */}
            <Text style={styles.title}>GỢI Ý CHO BẠN</Text>

            {suggestProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.product}
                onPress={() =>
                  navigation.navigate("Detail", { product: item })
                }
              >
                <Image source={{ uri: item.image }} style={styles.img} />

                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    {item.description}
                  </Text>
                </View>

                <Text style={styles.price}>
                  {item.price.toLocaleString()}đ
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}

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
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  logo: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#8B4513",
    letterSpacing: 2,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 10,
  },

  clear: {
    color: "gray",
  },

  trendRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },

  trendBig: {
    flex: 1,
    backgroundColor: "#e6b8a2",
    borderRadius: 15,
    padding: 15,
    justifyContent: "center",
  },

  trendTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  trendSmall: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  product: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },

  price: {
    fontWeight: "bold",
    color: "#8B4513",
  },
});
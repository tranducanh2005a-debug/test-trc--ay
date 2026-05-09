import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getOrders } from "../services/orderService";

export default function OrderHistoryView() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {
        console.log("ORDER ERROR:", err);
      }
    };

    loadOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.orderId}>Đơn #{item.id}</Text>
        <Text style={styles.status}>{item.status || "Đang xử lý"}</Text>
      </View>

      <Text style={styles.text}>
        Tổng tiền: {item.total?.toLocaleString()}đ
      </Text>

      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderId: {
    fontWeight: "bold",
  },

  status: {
    color: "#8B4513",
    fontSize: 12,
  },

  text: {
    marginTop: 5,
  },

  date: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
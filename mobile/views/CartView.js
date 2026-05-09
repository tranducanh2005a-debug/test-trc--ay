import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getCart, updateCart, deleteCart } from "../services/cartService";

export default function CartView() {
  const [cart, setCart] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selected, setSelected] = useState([]);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // LOAD CART
  const loadCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);

      setSelected((prev) =>
        prev.filter((id) =>
          res.data.some((item) => item.id === id)
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCart();
    }, [])
  );

  // UPDATE
  const handleUpdate = async (id, quantity) => {
    try {
      await updateCart(id, quantity);
      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteCart(id);
      setSelected((prev) => prev.filter((i) => i !== id));
      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  // SELECT
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === cart.length) {
      setSelected([]);
    } else {
      setSelected(cart.map((item) => item.id));
    }
  };

  // VOUCHER
  const applyVoucher = () => {
    if (code.trim().toUpperCase() === "ATH") {
      setDiscount(0.36);
      alert("Áp dụng mã ATH (-36%)");
    } else {
      setDiscount(0);
      alert("Mã không hợp lệ");
    }
  };

  // CALC
  const selectedItems = cart.filter((item) =>
    selected.includes(item.id)
  );

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = Math.min(total * discount, total);
  const finalTotal = total - discountAmount;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
        }}
      >
        <Text style={styles.title}>Giỏ hàng</Text>
        <Text style={styles.sub}>
          Bạn có {cart.length} sản phẩm
        </Text>

        {/* SELECT ALL */}
        <TouchableOpacity onPress={selectAll}>
          <Text style={{ marginBottom: 10 }}>
            {selected.length === cart.length
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </Text>
        </TouchableOpacity>

        {/* LIST */}
        {cart.map((item) => (
          <View key={item.id} style={styles.item}>
            
            {/* CHECKBOX */}
            <TouchableOpacity
              onPress={() => toggleSelect(item.id)}
              style={styles.checkbox}
            >
              <Ionicons
                name={
                  selected.includes(item.id)
                    ? "checkbox"
                    : "square-outline"
                }
                size={22}
                color="#8B4513"
              />
            </TouchableOpacity>

            {/* CLICK AREA */}
            <TouchableOpacity
              style={{ flex: 1, flexDirection: "row" }}
              onPress={() =>
                navigation.navigate("Detail", {
                  product: item, 
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.img} />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>Size: {item.size}</Text>

                <View style={styles.qtyBox}>
                  <TouchableOpacity
                    onPress={() =>
                      handleUpdate(
                        item.id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                  >
                    <Text style={styles.qtyBtn}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qty}>{item.quantity}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdate(item.id, item.quantity + 1)
                    }
                  >
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* RIGHT */}
            <View style={styles.right}>
              <Ionicons
                name="trash-outline"
                size={18}
                color="gray"
                onPress={() => handleDelete(item.id)}
              />

              <Text style={styles.price}>
                {(item.price * item.quantity).toLocaleString()}đ
              </Text>
            </View>
          </View>
        ))}

        {/* SUMMARY */}
        <View style={styles.summary}>
          <View style={styles.row}>
            <Text>Tạm tính</Text>
            <Text>{total.toLocaleString()}đ</Text>
          </View>

          {discount > 0 && (
            <View style={styles.row}>
              <Text>Giảm giá</Text>
              <Text style={{ color: "green" }}>
                -{discountAmount.toLocaleString()}đ
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.total}>
              {finalTotal.toLocaleString()}đ
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BUTTON */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 10 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.checkout,
            selected.length === 0 && { backgroundColor: "#ccc" },
          ]}
          disabled={selected.length === 0}
          onPress={() =>
            navigation.navigate("Checkout", {
              cart: selectedItems,
              discount,
              code,
            })
          }
        >
          <Text style={styles.checkoutText}>
            Thanh toán ({selected.length})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  sub: {
    color: "gray",
    marginBottom: 15,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  checkbox: {
    marginRight: 10,
  },

  img: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },

  name: {
    fontWeight: "bold",
  },

  meta: {
    fontSize: 12,
    color: "gray",
    marginVertical: 5,
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 100,
    justifyContent: "space-between",
  },

  qtyBtn: {
    fontSize: 18,
  },

  qty: {
    fontWeight: "bold",
  },

  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 80,
  },

  price: {
    color: "#8B4513",
    fontWeight: "bold",
    marginTop: 10,
  },

  voucher: {
    flexDirection: "row",
    marginVertical: 15,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },

  applyBtn: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
  },

  summary: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  totalLabel: {
    fontWeight: "bold",
  },

  total: {
    color: "#8B4513",
    fontWeight: "bold",
  },

  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  checkout: {
    backgroundColor: "#8B4513",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
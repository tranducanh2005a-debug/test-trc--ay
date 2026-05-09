import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createOrder } from "../services/orderService";
import { useNavigation } from "@react-navigation/native";

export default function CheckoutScreen() {
  const route = useRoute();
  const { cart } = route.params;

  const insets = useSafeAreaInsets();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [shipping, setShipping] = useState("fast");
  const [payment, setPayment] = useState("cod");

  // 🔥 PROMO
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const navigation = useNavigation();

  // ===== CALC =====
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = total * discountPercent;
  const shippingFee = shipping === "fast" ? 30000 : 15000;
  const finalTotal = total - discountAmount + shippingFee;

  // ===== APPLY CODE =====
  const applyCode = () => {
    const validCodes = ["ATH", "FASHION_ATH", "10DIEM"];

    if (validCodes.includes(promoCode.toUpperCase())) {
      setDiscountPercent(0.36);
      Alert.alert("🎉 Thành công", "Áp dụng giảm 36%");
    } else {
      setDiscountPercent(0);
      Alert.alert("Mã không hợp lệ");
    }
  };

  // ===== VALIDATE =====
  const validate = () => {
    if (!address.trim()) {
      Alert.alert("Vui lòng nhập địa chỉ");
      return false;
    }

    if (!phone.match(/^[0-9]{9,11}$/)) {
      Alert.alert("Số điện thoại không hợp lệ");
      return false;
    }

    if (cart.length === 0) {
      Alert.alert("Giỏ hàng trống");
      return false;
    }

    return true;
  };

  // ===== ORDER =====
  const handleOrder = async () => {
    if (!validate()) return;

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
        })),
        address,
        phone,
        total: finalTotal,
        payment,
        shipping,
      };

      await createOrder(payload);

      Alert.alert("Thành công 🎉", "Đặt hàng thành công!", [
        {
          text: "OK",
          onPress: () => navigation.replace("OrderSuccess"),
        },
      ]);
    } catch (err) {
      console.log("ORDER ERROR:", err.response?.data || err.message);
      Alert.alert("Lỗi đặt hàng");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
        }}
      >
        {/* ADDRESS */}
        <View style={styles.card}>
          <Text style={styles.title}>Thông tin nhận hàng</Text>

          <TextInput
            placeholder="Địa chỉ"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          <TextInput
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        {/* SHIPPING */}
        <View style={styles.card}>
          <Text style={styles.title}>Phương thức vận chuyển</Text>

          <TouchableOpacity
            style={[
              styles.option,
              shipping === "fast" && styles.selected,
            ]}
            onPress={() => setShipping("fast")}
          >
            <Text>Giao hàng nhanh</Text>
            <Text>30.000đ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              shipping === "save" && styles.selected,
            ]}
            onPress={() => setShipping("save")}
          >
            <Text>Tiết kiệm</Text>
            <Text>15.000đ</Text>
          </TouchableOpacity>
        </View>

        {/* 🔥 PROMO */}
        <View style={styles.card}>
          <Text style={styles.title}>Mã giảm giá</Text>

          <View style={styles.promoRow}>
            <TextInput
              placeholder="Nhập mã giảm giá."
              value={promoCode}
              onChangeText={setPromoCode}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />

            <TouchableOpacity style={styles.applyBtn} onPress={applyCode}>
              <Text style={{ color: "#fff" }}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          {discountPercent > 0 && (
            <Text style={styles.applied}>
              ✔ Đã áp dụng mã: {promoCode.toUpperCase()}
            </Text>
          )}
        </View>

        {/* PAYMENT */}
        <View style={styles.card}>
          <Text style={styles.title}>Phương thức thanh toán</Text>

          <View style={styles.paymentGrid}>
            <TouchableOpacity
              style={[
                styles.paymentItem,
                payment === "cod" && styles.selected,
              ]}
              onPress={() => setPayment("cod")}
            >
              <Ionicons name="cash-outline" size={24} />
              <Text style={styles.paymentText}>COD</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentItem, styles.disabled]}
              onPress={() => Alert.alert("Chưa hỗ trợ")}
            >
              <Ionicons name="card-outline" size={24} />
              <Text style={styles.paymentText}>Thẻ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentItem, styles.disabled]}
              onPress={() => Alert.alert("Chưa hỗ trợ")}
            >
              <Ionicons name="business-outline" size={24} />
              <Text style={styles.paymentText}>Ngân hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentItem, styles.disabled]}
              onPress={() => Alert.alert("Chưa hỗ trợ")}
            >
              <Ionicons name="wallet-outline" size={24} />
              <Text style={styles.paymentText}>Ví</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CART */}
        <View style={styles.card}>
          <Text style={styles.title}>Tóm tắt đơn hàng</Text>

          {cart.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImg} />

              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productMeta}>Size: {item.size}</Text>
                <Text style={styles.productPrice}>
                  {item.quantity} x {item.price.toLocaleString()}đ
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text>Tạm tính</Text>
            <Text>{total.toLocaleString()}đ</Text>
          </View>

          <View style={styles.row}>
            <Text>Phí vận chuyển</Text>
            <Text>{shippingFee.toLocaleString()}đ</Text>
          </View>

          <View style={styles.row}>
            <Text>Giảm giá</Text>
            <Text style={{ color: "green" }}>
              -{discountAmount.toLocaleString()}đ
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.total}>Tổng thanh toán</Text>
            <Text style={styles.total}>
              {finalTotal.toLocaleString()}đ
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.button} onPress={handleOrder}>
          <Text style={styles.buttonText}>Đặt hàng ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 15 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  title: { fontWeight: "bold", marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  option: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  selected: {
    borderColor: "#8B4513",
    backgroundColor: "#fff5f0",
  },

  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  paymentItem: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },

  paymentText: {
    marginTop: 5,
    fontSize: 12,
  },

  disabled: {
    opacity: 0.5,
  },

  productItem: {
    flexDirection: "row",
    marginBottom: 15,
  },

  productImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  productName: { fontWeight: "bold" },

  productMeta: {
    fontSize: 12,
    color: "gray",
  },

  productPrice: {
    color: "#8B4513",
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  total: {
    fontWeight: "bold",
    color: "#8B4513",
  },

  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#8B4513",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  promoRow: {
    flexDirection: "row",
    gap: 10,
  },

  applyBtn: {
    backgroundColor: "#8B4513",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
  },

  applied: {
    marginTop: 8,
    color: "green",
    fontSize: 12,
  },
});
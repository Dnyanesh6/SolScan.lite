import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export function SwapScreen() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("DAI");

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = () => {
    if (!fromAmount) return Alert.alert("Please enter an amount to swap");

    Alert.alert(
      "Swap Confirmation",
      `Swap ${fromAmount} ${fromToken} for ${toAmount} ${toToken}?`
    );
  };

  return (
    <SafeAreaProvider>
      <View style={s.container}>
        <Text style={s.title}>Swap Tokens</Text>

        <ScrollView contentContainerStyle={s.content}>

          {/* from card */}
          <View style={s.card}>
            
            <View style={s.row}>
              <TouchableOpacity style={s.tokenSelector}>
                <View style={[s.tokenIcon, { backgroundColor: "#627EEA" }]}>
                  <Text style={s.tokenIconText}>{fromToken}</Text>
                </View>

                <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
              </TouchableOpacity>

              <TextInput
                style={s.amountInput}
                value={fromAmount}
                onChangeText={setFromAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#666666"
              />
            </View>

            <View style={s.cardFooter}>
              <Text style={s.balanceText}>
                Balance: 0.0661 {fromToken}
              </Text>
              <Text style={s.usdText}>$499.749</Text>
            </View>
          </View>

          <View style={s.arrowContainer}>
            <TouchableOpacity style={s.swapArrow} onPress={swapTokens}>
              <Ionicons name="arrow-down" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            <View style={s.row}>
              <TouchableOpacity style={s.tokenSelector}>
                <View style={[s.tokenIcon, { backgroundColor: "#F5AC37" }]}>
                  <Text style={s.tokenIconText}>{toToken}</Text>
                </View>

                <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
              </TouchableOpacity>

              <TextInput
                style={s.amountInput}
                value={toAmount}
                onChangeText={setToAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#666666"
              />
            </View>

            <View style={s.cardFooter}>
              <Text style={s.balanceText}>
                Balance: 250 {toToken}
              </Text>
              <Text style={s.usdText}>$499.419</Text>
            </View>
          </View>

          <TouchableOpacity style={s.swapBtn} onPress={handleSwap}>
            <Text style={s.swapBtnText}>Swap</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: { // ⭐ NEW
    flex: 1,
    backgroundColor: "#0D0D12",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
    letterSpacing: -0.5,
  },

  content: {
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#1A1A24",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
    marginBottom: 20, // ⭐ UPDATED spacing
  },

  row: { // ⭐ NEW
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252530",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
  },

  tokenIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  tokenIconText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  amountInput: {
    fontSize: 40,
    fontWeight: "400",
    color: "#FFFFFF",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  balanceText: {
    fontSize: 14,
    color: "#666666",
  },

  usdText: {
    fontSize: 14,
    color: "#666666",
  },

  arrowContainer: { // ⭐ UPDATED
    alignItems: "center",
    marginTop: -30,
    marginBottom: -10,
    zIndex: 10,
  },

  swapArrow: {
    backgroundColor: "#0D0D12",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1A1A24",
  },

  swapBtn: {
    backgroundColor: "#14F195",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
  },

  swapBtnText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
  },
});

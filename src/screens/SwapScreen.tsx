import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from "react-native";

export function SwapScreen() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");

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
      `Swap ${fromAmount} ${fromToken} for ${toAmount} ${toToken}?`,
    );
  };

  return (
    <SafeAreaProvider>
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <View style={[s.card,{marginBottom: 10}]}>
        <TouchableOpacity style={s.tokenSelector} onPress={swapTokens}>
          <View style={[s.tokenIcon, {backgroundColor: "#9945FF"}]}>
            <Text style={s.tokenIconText}>{fromToken}</Text>
          </View>
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
        <Text style={s.balanceText}>Balance: 0.0661 {fromToken}</Text>
        <Text style={s.usdText}>≈ $499.4749USD</Text>
      </View>

      <View style={[s.card,{marginBottom: 10}]}>
        <TouchableOpacity style={s.tokenSelector} onPress={swapTokens}>
          <View style={[s.tokenIcon, {backgroundColor: "#9945FF"}]}>
            <Text style={s.tokenIconText}>{toToken}</Text>
          </View>
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

      <View style={s.arrowContainer}>
        <TouchableOpacity style={s.swapArrow} onPress={swapTokens}>
          <Ionicons name="arrow-down" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

            <TouchableOpacity style={s.swapBtn} onPress={handleSwap}>
        <Text style={s.swapBtnText}>Swap</Text>
      </TouchableOpacity>

    </ScrollView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1A1A24",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252530",
    paddingLeft: 8,
    paddingRight: 12,
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
  tokenName: {
    fontSize: 18,
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
  arrowContainer: {
    alignItems: "center",
    marginVertical: -22,
    zIndex: 10,
  },
  swapArrow: {
    backgroundColor: "#0D0D12",
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0D0D12",
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

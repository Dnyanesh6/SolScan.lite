import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
  SafeAreaViewBase,
} from "react-native";

const RPC = "https://api.mainnet-beta.solana.com";

const rpc = async (method: string, params: any[]) => {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

const getBalance = async (addr: string) => {
  const result = await rpc("getBalance", [addr]);
  return result.value / 1_000_000_000;
};

const getTokens = async (addr: string) => {
  const result = await rpc("getTokenAccountsByOwner", [
    addr,
    { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    { encoding: "jsonParsed" },
  ]);
  return (result.value || [])
    .map((a: any) => ({
      mint: a.account.data.parsed.info.mint,
      amount: a.account.data.parsed.info.tokenAmount.uiAmount,
    }))
    .filter((t: any) => t.amount > 0);
};

const getTxns = async (addr: string) => {
  const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
  return sigs.map((s: any) => ({
    sig: s.signature,
    time: s.blockTime,
    ok: !s.err,
  }));
};

const short = (s: string, n = 4) => `${s.slice(0, n)}...${s.slice(-n)}`;

const timeAgo = (ts: number) => {
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function App() {
  const [address, setAddress] = useState(""); // the addres input by the user
  const [loading, setLoading] = useState(false); // whether we are currently loading data
  const [balance, setBalance] = useState<number | null>(null); // the SOL balance of the address
  const [tokens, setTokens] = useState<any[]>([]); // the SPL token held by the address
  const [txns, setTxns] = useState<any[]>([]); // the recent transactions of the address

  const search = async () => {
    const addr = address.trim();
    if (!addr) return Alert.alert("Enter a wallet address");

    setLoading(true);
    try {
      const [bal, tok, tx] = await Promise.all([
        getBalance(addr),
        getTokens(addr),
        getTxns(addr),
      ]);
      setBalance(bal);
      setTokens(tok);
      setTxns(tx);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll}>
        <View style={s.inputContainer}>
          <TextInput
            style={s.input}
            placeholder="Add wallet address..."
            placeholderTextColor="#555"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity style={s.btn} onPress={search} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={s.btnText}>Search</Text>
            )}
          </TouchableOpacity>

          {balance !== null && (
            <View style={s.card}>
              <Text style={s.label}>SOL Balance</Text>
              <Text style={s.balance}>{balance.toFixed(4)}</Text>
              <Text style={s.sol}>SOL</Text>
              <Text style={s.addr}>{short(address.trim(), 6)}</Text>
            </View>
          )}

          {tokens.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={s.title}>Tokens ({tokens.length})</Text>
              <FlatList
                data={tokens.slice(0, 10)}
                keyExtractor={(t) => t.mint}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={s.row}>
                    <Text style={s.tokenMint}>{short(item.mint, 4)}</Text>
                    <Text style={s.tokenAmount}>{item.amount}</Text>
                  </View>
                )}
              />
            </View>
          )}

          {txns.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={s.title}>Recent Transactions ({txns.length})</Text>
              <FlatList
                data={txns.slice(0, 10)}
                keyExtractor={(t) => t.sig}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={s.row}>
                    <Text style={s.tokenMint}>{short(item.sig, 4)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(
                          `https://solscan.io/tx/${item.sig}`,
                        ).catch(() => Alert.alert("Failed to open URL"));
                      }}
                    >
                      {item.ok ? (
                        <Text style={{ color: "#14F195" }}>Success</Text>
                      ) : (
                        <Text style={{ color: "#FF6B6B" }}>Failed</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0a1a" },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    marginBottom: 28,
    fontWeight: "400",
  },

  inputContainer: {
    backgroundColor: "#16161D",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 16,
    fontWeight: "400",
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    backgroundColor: "#14F195",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#14F195",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  btnDisable: {
    opacity: 0.6,
  },
  btnText: {
    color: "#0D0D12",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f0f23",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  addr: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
  },
  tokenMint: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  tokenAmount: {
    color: "#14F195",
    fontSize: 14,
    fontWeight: "600",
  },
  balance: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  label: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "400",
  },
  sol: {
    color: "#14F195",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#16161D",
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
});

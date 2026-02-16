import {  useState } from "react";
import { useRouter } from "expo-router";
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
import { useWalletStore } from "../../src/stores/walletStore";
import { FavoriteButton } from "../../src/components/favouriteButton";
import { Ionicons } from "@expo/vector-icons";

export default function WalletScreen() {
  const [address, setAddress] = useState(""); // the addres input by the user
  const [loading, setLoading] = useState(false); // whether we are currently loading data
  const [balance, setBalance] = useState<number | null>(null); // the SOL balance of the address
  const [tokens, setTokens] = useState<any[]>([]); // the SPL token held by the address
  const [txns, setTxns] = useState<any[]>([]); // the recent transactions of the address


  const addToHistory = useWalletStore((s) => s.addToHistory); // function to add an address to search history
  const searchHistory = useWalletStore((s) => s.searchHistory);
  const isDevnet = useWalletStore((s)=> s.isDevnet);
  const toggleNetwork = useWalletStore((s) => s.toggleNetwork);
  const router = useRouter();

  const RPC = isDevnet 
  ? "https://api.devnet.solana.com"
  : "https://api.mainnet-beta.solana.com";

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


  const search = async () => {
    const addr = address.trim();
    if (!addr) return Alert.alert("Enter a wallet address");

    setLoading(true);
    addToHistory(addr); // add to history when search is initiated
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

  const searchFromHistory = (addr:string) => {
    setAddress(addr);
    addToHistory(addr); // move the address to the top of history
    setLoading(true);
    Promise.all([
      getBalance(addr),
      getTokens(addr),
      getTxns(addr)
    ]).then(([bal, tok, tx]) => {
      setBalance(bal);
      setTokens(tok);
      setTxns(tx);
    })
    .catch((e: any) => {
      Alert.alert("Error", e.message);
    })
    .finally(() =>{
      setLoading(false);
    })
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll}>
        {/* header */}
        <View style={s.header}>
        <View>
        <Text style={s.title}>SolScan Lite</Text>
        <Text style={s.subtitle}>Explore any solana wallet</Text>
        </View>

        <View style={s.networkContainer}>
          <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} onPress={toggleNetwork}>
            <View style={[s.networkDot, isDevnet ? s.devnetDot : s.mainnetDot]}/>
            <Text style={s.networkText}>{isDevnet ? "Devnet" : "Mainnet"}</Text>
          </TouchableOpacity>
        </View>
        </View>

        {/* Search box */}
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
        </View>

          <View style={s.btnRow}>
            <TouchableOpacity style={s.btn} onPress={search} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={s.btnText}>Search</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {setAddress("");
              setBalance(null);
              setTokens([]);
              setTxns([]);
            }}>
              <Text style={s.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {
            searchHistory.length > 0 && (
              <View style={s.historySection}>
                <Text style={[s.historyTitle, {padding: 10}]}>Search History</Text>
                {searchHistory.slice(0,5).map((addr, i) => (
                  <TouchableOpacity
                  key={addr}
                  style={s.historyItem}
                  onPress={() => {searchFromHistory(addr)}}
                  >
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={{color: "#FFFFFF", marginLeft: 8, fontSize: 16,paddingBottom: 2}}>
                      {short(addr, 10)}
                    </Text>
                    <Ionicons 
                      name="chevron-forward-outline" 
                      size={16} 
                      color="#6B7280" style={{marginLeft: 8}} />
                  </TouchableOpacity>
                ))}
              </View>
            )
          }

        <View>
          {balance !== null && (
            <View style={s.card}>
            <View style={{position: "absolute", top: 16, right: 16}}>
              <FavoriteButton address={address} />
            </View>
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
                  <TouchableOpacity style={s.row} onPress={() => router.push(`/token/${item.mint}`)}>
                    <Text style={s.mint}>{short(item.mint, 4)}</Text>
                    <Text style={s.amount}>{item.amount}</Text>
                  </TouchableOpacity>
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
                    <Text style={s.mint}>{short(item.sig, 4)}</Text>
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
  safe: {
    flex: 1,
    backgroundColor: "#0D0D12",
    paddingTop: 16,
  },
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
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    marginBottom: 28,
    fontWeight: "400",
  },

  inputContainer: {
    backgroundColor: "#16161D",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2A2A35",
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 12,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 14,
    fontWeight: "400",
  },

  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  clearText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    borderColor: "#2A2A35",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  btn: {
    flex: 1,
    backgroundColor: "#14F195",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#14F195",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#0D0D12",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  btnGhost: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#16161D",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  btnGhostText: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#16161D",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  label: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  balance: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -1,
  },
  sol: {
    color: "#14F195",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  addr: {
    color: "#9945FF",
    fontSize: 13,
    fontFamily: "monospace",
    marginTop: 16,
    backgroundColor: "#1E1E28",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
  },

  section: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 32,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  header:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#16161D",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  mint: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "500",
  },
  amount: {
    color: "#14F195",
    fontSize: 15,
    fontWeight: "600",
  },
  time: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "400",
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: "600",
  },

  // network toggle styles
  networkContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16161D",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2A2A35",
    gap: 6,
  },
  networkText:{
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  networkDot:{
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#14F195",
  },
  devnetDot:{
    backgroundColor: "#e09514",
  },
  mainnetDot:{
    backgroundColor: "#14F195",
  },

  // history styles
  historyTitle:{
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    paddingTop: 12,
    paddingLeft: 20,
  },
  historySection:{
    marginTop: 24,
    backgroundColor: "#16161D",
    borderRadius: 20,
    borderWidth: 1,
  },
  historyItem:{
    flex:1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    color: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  }
});

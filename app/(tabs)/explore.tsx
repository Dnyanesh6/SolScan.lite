import { 
    Text, 
    View,
    StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={s.safe}>
                <View style={s.center}>
                    <Text style={s.title}>Explore</Text>
                    <Text style={s.subtitle}>Discover trending tokens, NFTs, and more.</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const s = StyleSheet.create({
    safe:{
        flex:1,
        backgroundColor: "#0D0D12",
    },
    center:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    },
    title:{
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "700",
    },
    subtitle:{
        color: "#6B7280",
        fontSize: 15,
        marginTop: 8,
    }
})
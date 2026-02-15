        import { StyleSheet, Text, View } from 'react-native'
        import React from 'react'
        import { Ionicons } from "@expo/vector-icons";
        import { SafeAreaView } from 'react-native-safe-area-context';
        export default function orders() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text>orders</Text>
                </View>
            </SafeAreaView>
        )
        }

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
        })
        import { StyleSheet, Text, View } from 'react-native'
        import React from 'react'

        export default function settings() {
        return (
            <View style={styles.container}>
            <Text style={styles.text}>settings</Text>
            </View>
        )
        }

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#16161D',
            },
            text: {
                color: '#fff',
                fontSize: 24,
                fontWeight: "700",
            },
        })
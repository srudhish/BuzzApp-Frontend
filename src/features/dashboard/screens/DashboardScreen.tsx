import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DashboardScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Dashboard!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
    },
});

export default DashboardScreen;
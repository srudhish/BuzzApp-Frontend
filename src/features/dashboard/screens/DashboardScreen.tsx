import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../../app/context/AuthContext';

const DashboardScreen = () => {
    const { logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Dashboard 🎉</Text>
            <Button title="Logout" onPress={logout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 22, marginBottom: 20 },
});

export default DashboardScreen;

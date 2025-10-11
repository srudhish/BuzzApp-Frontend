import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { UserRole } from '../../auth/types';

const CompanyDashboard = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        // future: fetch company-level analytics, sales data, etc.
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {user?.role === UserRole.Owner
                    ? 'Owner Dashboard'
                    : user?.role === UserRole.Supplier
                        ? 'Supplier Dashboard'
                        : 'Buyer Dashboard'}
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardText}>
                    Welcome, {user?.name}! 👋
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardText}>
                    Company ID: {user?.companyId || 'N/A'}
                </Text>
            </View>

            {/* Placeholder for future widgets */}
            <View style={styles.card}>
                <Text style={styles.cardText}>📊 Analytics coming soon</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardText}>🔔 Notifications area</Text>
            </View>
        </ScrollView>
    );
};

export default CompanyDashboard;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f6f6f6',
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    cardText: {
        fontSize: 16,
    },
});

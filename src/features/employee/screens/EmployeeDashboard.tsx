import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { UserRole } from '../../auth/types';

const EmployeeDashboard = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        // future: fetch employee shift, attendance, or assigned jobs
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {user?.role === UserRole.Supervisor
                    ? 'Supervisor Dashboard'
                    : 'Labor Dashboard'}
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardText}>
                    Hello, {user?.name}! 👋
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardText}>Company: {user?.companyId || 'N/A'}</Text>
            </View>

            {/* Placeholder for future widgets */}
            <View style={styles.card}>
                <Text style={styles.cardText}>📅 Tasks & Attendance</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardText}>📈 Performance metrics</Text>
            </View>
        </ScrollView>
    );
};

export default EmployeeDashboard;

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

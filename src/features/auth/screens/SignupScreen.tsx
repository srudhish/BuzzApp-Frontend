// src/features/auth/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { signupCompany, signupEmployee } from '../services/authService';
import { useAuth } from '../../../app/context/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    // accept mobile/otp from route.params if present
    const params: any = (route as any).params || {};
    const [mobile, setMobile] = useState(params.mobile || '');
    const [otp, setOtp] = useState(params.otp || '');
    const [activeTab, setActiveTab] = useState<'company' | 'employee'>('company');
    const { setAuth } = useAuth();

    const onSignupCompany = async () => {
        try {
            const res: any = await signupCompany(mobile, otp);
            if (res.token && res.role) {
                await setAuth(res.token, res.role);
                navigation.reset({ index: 0, routes: [{ name: 'OwnerDashboard' as never }] });
            }
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Signup failed');
        }
    };

    const onSignupEmployee = async () => {
        try {
            const res: any = await signupEmployee(mobile, otp);
            if (res.token && res.role) {
                await setAuth(res.token, res.role);
                navigation.reset({ index: 0, routes: [{ name: 'EmployeeDashboard' as never }] });
            }
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Signup failed');
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Button title="Signup as Company" onPress={() => setActiveTab('company')} />
                <Button title="Signup as Employee" onPress={() => setActiveTab('employee')} />
            </View>

            <Text>Mobile</Text>
            <TextInput value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

            <Text>OTP</Text>
            <TextInput value={otp} onChangeText={setOtp} keyboardType="numeric" />

            {activeTab === 'company' ? (
                <Button title="Complete Company Signup" onPress={onSignupCompany} />
            ) : (
                <Button title="Complete Employee Signup" onPress={onSignupEmployee} />
            )}
        </View>
    );
}
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { signupCompany, signupEmployee, sendOtp } from '../services/authService';
import { useAuth } from '../../../app/context/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const params: any = (route as any).params || {};

    const [mobile, setMobile] = useState(params.mobile || '');
    const [otp, setOtp] = useState(params.otp || '');
    const [activeTab, setActiveTab] = useState<'company' | 'employee'>('company');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const { setAuth } = useAuth();

    // 📱 Send OTP (for signup)
    const onSendOtp = async () => {
        if (!mobile) {
            Alert.alert('Invalid', 'Please enter a valid mobile number');
            return;
        }
        try {
            await sendOtp(mobile, true); // 👈 second param true for signup
            setIsOtpSent(true);
            Alert.alert('Success', 'OTP sent successfully');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to send OTP');
        }
    };

    const onSignupCompany = async () => {
        try {
            const res: any = await signupCompany(mobile, otp);
            if (res.token && res.role) {
                await setAuth(res.token, res.role, res.userId || '');
                navigation.reset({ index: 0, routes: [{ name: 'Dashboard' as never }] });
            }
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Signup failed');
        }
    };

    const onSignupEmployee = async () => {
        try {
            const res: any = await signupEmployee(mobile, otp);
            if (res.token && res.role) {
                await setAuth(res.token, res.role, res.userId || '');
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
            <TextInput
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
            />

            <Button title={isOtpSent ? "Resend OTP" : "Send OTP"} onPress={onSendOtp} />

            <Text style={{ marginTop: 12 }}>OTP</Text>
            <TextInput
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
            />

            {activeTab === 'company' ? (
                <Button title="Complete Company Signup" onPress={onSignupCompany} />
            ) : (
                <Button title="Complete Employee Signup" onPress={onSignupEmployee} />
            )}
        </View>
    );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { sendOtp, verifyOtp } from '../services/authService';
import { useAuth } from '../../../app/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const navigation = useNavigation<any>();
    const { setAuth } = useAuth();

    const onSendOtp = async () => {
        try {
            await sendOtp(mobile, false); // false => login mode
            setOtpSent(true);
            Alert.alert('OTP Sent', 'Please check your phone.');
        } catch (e: any) {
            Alert.alert('Login Failed', e.message || 'The user is not registered, please signup.');
        }
    };

    const onVerify = async () => {
        try {
            const res = await verifyOtp(mobile, otp);
            if (res.isNewUser) {
                // navigate to signup with mobile and otp passed so user doesn't need to re-enter
                navigation.navigate('Signup', { mobile, otp });
                return;
            }
            // logged-in user
            if (res.token && res.role) {
                await setAuth(res.token, res.role, res.userId ?? '');
                // navigate to role-based dashboard
                // if (res.role.toLowerCase() === 'owner') {
                //     navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
                // } else {
                //     navigation.reset({ index: 0, routes: [{ name: 'EmployeeDashboard' }] });
                // }
            }
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Verify failed');
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <Text>Mobile Number</Text>
            <TextInput value={mobile} onChangeText={setMobile} keyboardType="phone-pad" placeholder="Enter mobile" />
            <Button title="Send OTP" onPress={onSendOtp} />
            {otpSent && (
                <>
                    <Text>Enter OTP</Text>
                    <TextInput value={otp} onChangeText={setOtp} keyboardType="numeric" />
                    <Button title="Verify OTP" onPress={onVerify} />
                </>
            )}
            <Button title="Signup instead" onPress={() => navigation.navigate('Signup')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,
    },
});

export default LoginScreen;
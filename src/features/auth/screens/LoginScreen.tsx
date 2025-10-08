import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { sendOtp, verifyOtp } from '../services/authService';
import { useAuth } from '../../../app/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const { setUserToken } = useAuth();
    const navigation = useNavigation();

    const handleSendOtp = async () => {
        try {
            await sendOtp(phone);
            setOtpSent(true);
        } catch (error) {
            console.log('Send OTP error:', error);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await verifyOtp(phone, otp);
            setUserToken(response.token);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' as never }],
            });
        } catch (error) {
            console.log('Verify OTP error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>OTP Login</Text>

            <TextInput
                placeholder="Enter phone number"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
            />

            {otpSent && (
                <TextInput
                    placeholder="Enter OTP"
                    style={styles.input}
                    value={otp}
                    onChangeText={setOtp}
                />
            )}

            {!otpSent ? (
                <Button title="Send OTP" onPress={handleSendOtp} />
            ) : (
                <Button title="Verify OTP" onPress={handleVerifyOtp} />
            )}
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
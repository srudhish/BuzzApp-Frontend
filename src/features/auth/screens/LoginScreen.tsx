import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { loginUser } from '../slices/authSlice';
import { useAuth } from '../../../app/context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const { isHydrating } = useAuth();
    const { isLoading } = useAppSelector((state) => state.auth);

    const [mobileNumber, setMobileNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // Mocked OTP send (replace with backend sendOtp)
    const handleSendOtp = async () => {
        if (!mobileNumber) {
            Alert.alert('Invalid', 'Please enter a valid mobile number');
            return;
        }
        try {
            setOtpSent(true);
            Alert.alert('OTP Sent', 'Please enter the OTP to continue');
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to send OTP');
        }
    };

    const handleLogin = async () => {
        if (!mobileNumber || !otpCode) {
            Alert.alert('Invalid', 'Please enter both mobile number and OTP');
            return;
        }
        try {
            const res = await dispatch(loginUser({ mobileNumber, otpCode })).unwrap();
            if (res?.tokens?.accessToken) {
                Alert.alert('Login Success', 'Redirecting...');
            }
        } catch (err: any) {
            Alert.alert('Login Failed', err || 'Invalid credentials');
        }
    };

    if (isHydrating) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back 👋</Text>

                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    keyboardType="phone-pad"
                    style={styles.input}
                    placeholder="Enter mobile number"
                />

                {otpSent && (
                    <>
                        <Text style={styles.label}>OTP</Text>
                        <TextInput
                            value={otpCode}
                            onChangeText={setOtpCode}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="Enter OTP"
                        />
                    </>
                )}

                {!otpSent ? (
                    <TouchableOpacity
                        style={[styles.button, isLoading && { opacity: 0.7 }]}
                        onPress={handleSendOtp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Send OTP</Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, isLoading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')}
                    style={{ marginTop: 15 }}
                >
                    <Text style={styles.link}>
                        Don’t have an account?{' '}
                        <Text style={styles.linkHighlight}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    link: {
        textAlign: 'center',
        color: '#6c757d',
    },
    linkHighlight: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

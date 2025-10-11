import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    Alert,
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {
    sendOtp,
    signupCompany,
    signupEmployee,
} from '../services/authService';
import { useAppDispatch } from '../../../app/store';
import { loginUser } from '../slices/authSlice';
import { useAuth } from '../../../app/context/AuthContext';

const SignupScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const { isHydrating } = useAuth();

    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [activeTab, setActiveTab] = useState<'company' | 'employee'>('company');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!mobile) {
            Alert.alert('Invalid', 'Please enter a valid mobile number');
            return;
        }

        try {
            setLoading(true);
            await sendOtp(mobile, true);
            setIsOtpSent(true);
            Alert.alert('Success', 'OTP sent successfully');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!mobile || !otp) {
            Alert.alert('Invalid', 'Please enter both mobile and OTP');
            return;
        }

        try {
            setLoading(true);
            let res;
            if (activeTab === 'company') {
                res = await signupCompany(mobile, otp);
            } else {
                res = await signupEmployee(mobile, otp);
            }

            if (res?.token && res?.role) {
                await dispatch(
                    loginUser({
                        mobileNumber: mobile,
                        otpCode: otp,
                    })
                );
                Alert.alert('Success', 'Signup successful! Redirecting...');
            } else {
                Alert.alert('Signup Failed', 'No valid token or role received.');
            }
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Signup failed');
        } finally {
            setLoading(false);
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
                <View style={styles.tabContainer}>
                    <Button
                        title="Signup as Company"
                        onPress={() => setActiveTab('company')}
                        color={activeTab === 'company' ? '#007bff' : '#aaa'}
                    />
                    <Button
                        title="Signup as Employee"
                        onPress={() => setActiveTab('employee')}
                        color={activeTab === 'employee' ? '#007bff' : '#aaa'}
                    />
                </View>

                <Text style={styles.label}>Mobile</Text>
                <TextInput
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                    style={styles.input}
                    placeholder="Enter mobile number"
                />

                <Button
                    title={isOtpSent ? 'Resend OTP' : 'Send OTP'}
                    onPress={handleSendOtp}
                    disabled={loading}
                />

                {isOtpSent && (
                    <>
                        <Text style={styles.label}>OTP</Text>
                        <TextInput
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="Enter OTP"
                        />

                        <Button
                            title={
                                activeTab === 'company'
                                    ? 'Complete Company Signup'
                                    : 'Complete Employee Signup'
                            }
                            onPress={handleSignup}
                            disabled={loading}
                        />
                    </>
                )}

                <View style={{ marginTop: 20 }}>
                    <Text style={styles.link}>
                        Already have an account?{' '}
                        <Text
                            style={styles.linkHighlight}
                            onPress={() => navigation.navigate('Login')}
                        >
                            Login
                        </Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SignupScreen;

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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
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

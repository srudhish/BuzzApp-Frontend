import React from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAppDispatch } from "../../../app/store";
import { useForm, Controller } from "react-hook-form";
import { setCredentials } from "../authSlice";
import axios from "axios";

export default function LoginScreen() {
    const dispatch = useAppDispatch();
    const { control, handleSubmit } = useForm();
    const onSubmit = async (data: any) => {
        try {
            const res = await axios.post('https://localhost:7295/api/Auth/VerifyOtp', data);
            dispatch(setCredentials({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
                user: res.data.user,
            }));
        } catch (error) {
            console.error("Login Failed", error);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login via OTP</Text>
            <Controller control={control} name="phoneNumber" render={({ field: { onChange, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="Enter Phone Number"
                    value={value}
                    onChangeText={onChange}
                />
            )} />
            <Button title="Send OTP" onPress={handleSubmit(onSubmit)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 12,
        borderRadius: 8
    },
});
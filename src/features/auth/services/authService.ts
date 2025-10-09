import axios from "axios";

const API_BASE_URL = 'http://192.168.1.36:5210/api';
// 👆 use your backend URL (10.0.2.2 works for Android emulator if backend runs on localhost:5000)

export const sendOtp = async (phone: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { mobileNumber: phone });
    return response.data;
};

export const verifyOtp = async (phone: string, otp: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { mobileNumber: phone, otp });
    return response.data;
};

export const login = async (phone: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { phone });
    return response.data;
};

export const logout = async () => {
    // If needed — handle server-side logout
    return true;
};
import axios from "axios";
import { UserProfileUpdateDto } from "../types";

const API_BASE = 'http://192.168.1.36:5210/api';
// 👆 use your backend URL (10.0.2.2 works for Android emulator if backend runs on localhost:5000)

type VerifyResponse = {
    isNewUser: boolean;
    token?: string;
    role?: string;
    userId?: string;
};

export const sendOtp = async (mobile: string, isSignup = false) => {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: mobile, isSignup }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to send OTP");
    }

    return await res.json();
};

export const verifyOtp = async (mobile: string, otpCode: string): Promise<VerifyResponse> => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: mobile, otpCode })
    });
    if (res.status === 401) {
        const txt = await res.text();
        throw new Error(txt || "Unauthorized");
    }
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Verify OTP failed");
    }
    return (await res.json()) as VerifyResponse;
};

export const signupCompany = async (mobile: string, otpCode: string) => {
    const res = await fetch(`${API_BASE}/auth/signup/company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: mobile, otpCode })
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Signup company failed");
    }
    return await res.json(); // expected: { token, role, userId }
};

export const signupEmployee = async (mobile: string, otpCode: string) => {
    const res = await fetch(`${API_BASE}/auth/signup/employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: mobile, otpCode })
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Signup employee failed");
    }
    return await res.json(); // expected: { token, role, userId }
};

/**
 * Submit user profile to backend
 * @param userId - ID of the logged-in user
 * @param data - UserProfileUpdateDto
 * @param token - JWT token from AuthContext
 */
export const submitProfile = async (
    userId: string,
    data: UserProfileUpdateDto,
    token: string
) => {
    const res = await fetch(`${API_BASE}/User/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update profile");
    }

    return await res.json(); // expected: { message: "Profile updated successfully" }
};

export const getCurrentUser = async (token: string, userId: string) => {
    const res = await fetch(`${API_BASE}/User/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to fetch user");
    }

    return await res.json(); // return user object
};
import { get, post, put } from '../../api/apiClient';
import { UserProfileUpdateDto, UserRole } from '../types';

const AUTH_PREFIX = '/auth';
const USER_PREFIX = '/User';

type SendOtpRequest = {
    mobileNumber: string;
    isSignup: boolean;
};

type VerifyOtpRequest = {
    mobileNumber: string;
    otpCode: string;
};

type SignupResponse = {
    token: string;
    role: UserRole;
    userId: string;
};

type SendOtpResponse = {
    message?: string;
};

export type VerifyResponse = {
    isNewUser: boolean;
    token?: string;
    role?: UserRole;
    userId?: string;
};

export const sendOtp = async (mobile: string, isSignup = false) =>
    post<SendOtpRequest, SendOtpResponse>(`${AUTH_PREFIX}/send-otp`, {
        mobileNumber: mobile,
        isSignup,
    });

export const verifyOtp = async (mobile: string, otpCode: string): Promise<VerifyResponse> =>
    post<VerifyOtpRequest, VerifyResponse>(`${AUTH_PREFIX}/verify-otp`, {
        mobileNumber: mobile,
        otpCode,
    });

export const signupCompany = async (mobile: string, otpCode: string) =>
    post<VerifyOtpRequest, SignupResponse>(`${AUTH_PREFIX}/signup/company`, {
        mobileNumber: mobile,
        otpCode,
    });

export const signupEmployee = async (mobile: string, otpCode: string) =>
    post<VerifyOtpRequest, SignupResponse>(`${AUTH_PREFIX}/signup/employee`, {
        mobileNumber: mobile,
        otpCode,
    });

export const submitProfile = async (userId: string, data: UserProfileUpdateDto, token: string) =>
    put<UserProfileUpdateDto, { message: string }>(`${USER_PREFIX}/${userId}`, data, {
        authToken: token,
    });

export const getCurrentUser = async <TResponse = unknown>(token: string, id: string) =>
    get<TResponse>(`${USER_PREFIX}/${id}`, {
        authToken: token,
    });

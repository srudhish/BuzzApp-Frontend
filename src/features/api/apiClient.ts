import { API_BASE_URL } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local refresh to avoid circular deps with authService
const refreshTokensDirect = async (
    refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return null;
        return (await res.json()) as { accessToken: string; refreshToken: string };
    } catch {
        return null;
    }
};

// Common fetch wrapper with token refresh logic
export const apiClient = async <TResponse = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<TResponse> => {
    const token = await AsyncStorage.getItem('@access_token');
    const refreshToken = await AsyncStorage.getItem('@refresh_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // 🔁 Handle unauthorized & try refresh once
    if (response.status === 401 && refreshToken) {
        try {
            const newTokens = await refreshTokensDirect(refreshToken);
            if (newTokens?.accessToken) {
                await AsyncStorage.setItem('@access_token', newTokens.accessToken);
                await AsyncStorage.setItem('@refresh_token', newTokens.refreshToken);
                // Retry the original request with new access token
                const retryHeaders: HeadersInit = {
                    ...headers,
                    Authorization: `Bearer ${newTokens.accessToken}`,
                };
                response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    ...options,
                    headers: retryHeaders,
                });
            }
        } catch (refreshError) {
            console.warn('Token refresh failed:', refreshError);
            throw new Error('Session expired. Please log in again.');
        }
    }

    if (!response.ok) {
        const errText = await response.text();
        let message = 'An unknown error occurred.';
        try {
            const errJson = JSON.parse(errText);
            message = errJson.message || message;
        } catch {
            message = errText || message;
        }
        throw new Error(message);
    }

    try {
        return (await response.json()) as TResponse;
    } catch {
        return {} as TResponse;
    }
};

// Generic request methods
export const get = <TResponse = any>(
    url: string,
    extras?: { authToken?: string }
) =>
    apiClient<TResponse>(url, {
        method: 'GET',
        headers: extras?.authToken
            ? { Authorization: `Bearer ${extras.authToken}` }
            : undefined,
    });

export const post = <TBody = any, TResponse = any>(
    url: string,
    body?: TBody,
    extras?: { authToken?: string }
) =>
    apiClient<TResponse>(url, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
        headers: extras?.authToken
            ? { Authorization: `Bearer ${extras.authToken}` }
            : undefined,
    });

export const put = <TBody = any, TResponse = any>(
    url: string,
    body?: TBody,
    extras?: { authToken?: string }
) =>
    apiClient<TResponse>(url, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
        headers: extras?.authToken
            ? { Authorization: `Bearer ${extras.authToken}` }
            : undefined,
    });

export const del = <TResponse = any>(url: string) =>
    apiClient<TResponse>(url, { method: 'DELETE' });

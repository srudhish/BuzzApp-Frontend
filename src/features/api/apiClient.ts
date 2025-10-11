import { API_BASE_URL } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshTokens } from '../../features/auth/services/authService';

// Common fetch wrapper with token refresh logic
export const apiClient = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    const token = await AsyncStorage.getItem('@access_token');
    const refreshToken = await AsyncStorage.getItem('@refresh_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // 🔁 Handle unauthorized & try refresh once
    if (response.status === 401 && refreshToken) {
        try {
            const newTokens = await refreshTokens(refreshToken);
            if (newTokens?.accessToken) {
                await AsyncStorage.setItem('@access_token', newTokens.accessToken);
                await AsyncStorage.setItem('@refresh_token', newTokens.refreshToken);
                // Retry the original request with new access token
                const retryHeaders = {
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
        return await response.json();
    } catch {
        return {};
    }
};

// Generic request methods
export const get = (url: string) => apiClient(url, { method: 'GET' });
export const post = (url: string, body?: any) =>
    apiClient(url, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
    });
export const put = (url: string, body?: any) =>
    apiClient(url, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
    });
export const del = (url: string) => apiClient(url, { method: 'DELETE' });

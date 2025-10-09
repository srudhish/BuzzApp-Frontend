import AsyncStorage from '@react-native-async-storage/async-storage';

export const authFetch = async (url: string, opts: RequestInit = {}) => {
    const token = await AsyncStorage.getItem('@user_token');
    const headers = {
        ...(opts.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
    };
    return fetch(url, { ...opts, headers });
};
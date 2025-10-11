import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants/storageKeys';
import { UserRole } from '../../features/auth/types';

export interface PersistedAuthState {
    token: string | null;
    role: UserRole | null;
    userId: string | null;
}

const parseRole = (rawRole: string | null): UserRole | null => {
    if (!rawRole) {
        return null;
    }

    const numericRole = Number(rawRole);
    return Number.isNaN(numericRole) ? null : (numericRole as UserRole);
};

export const loadAuthState = async (): Promise<PersistedAuthState> => {
    try {
        const [[, token], [, role], [, userId]] = await AsyncStorage.multiGet([
            STORAGE_KEYS.token,
            STORAGE_KEYS.role,
            STORAGE_KEYS.userId,
        ]);

        return {
            token,
            role: parseRole(role),
            userId,
        };
    } catch (error) {
        console.warn('Failed to load auth state from storage', error);
        return { token: null, role: null, userId: null };
    }
};

export const persistAuthState = async (token: string, role: UserRole, userId: string) => {
    try {
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.token, token],
            [STORAGE_KEYS.role, String(role)],
            [STORAGE_KEYS.userId, userId],
        ]);
    } catch (error) {
        console.warn('Failed to persist auth state', error);
    }
};

export const clearAuthState = async () => {
    try {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.token,
            STORAGE_KEYS.role,
            STORAGE_KEYS.userId,
        ]);
    } catch (error) {
        console.warn('Failed to clear auth state', error);
    }
};

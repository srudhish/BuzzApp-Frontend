import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '@features/auth/types';

type AuthContextType = {
    userToken: string | null;
    role: UserRole | null;
    userId: string | null;
    setAuth: (token: string, role: UserRole, userId: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const isAuthenticated = !!userToken;

    useEffect(() => {
        // load auth info from storage on mount
        (async () => {
            try {
                await AsyncStorage.removeItem('@user_token');
                await AsyncStorage.removeItem('@user_role');
                await AsyncStorage.removeItem('@user_id');
                setUserToken(null);
                setRole(null);
                setUserId(null);
            } catch (e) {
                console.warn('Failed to clear auth on app start', e);
            }
        })();
    }, []);

    const setAuth = async (token: string, roleVal: UserRole, id: string) => {
        setUserToken(token);
        setRole(roleVal);
        setUserId(id);
        await AsyncStorage.setItem('@user_token', token);
        await AsyncStorage.setItem('@user_role', String(roleVal));
        await AsyncStorage.setItem('@user_id', id);
    };

    const logout = async () => {
        setUserToken(null);
        setRole(null);
        setUserId(null);
        await AsyncStorage.removeItem('@user_token');
        await AsyncStorage.removeItem('@user_role');
        await AsyncStorage.removeItem('@user_id');
    };

    return (
        <AuthContext.Provider value={{ userToken, role, userId, setAuth, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

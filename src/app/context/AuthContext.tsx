import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    userToken: string | null;
    role: string | null;
    setAuth: (token: string, role: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const isAuthenticated = !!userToken;

    useEffect(() => {
        // load token from storage on mount
        (async () => {
            try {
                const token = await AsyncStorage.getItem('@user_token');
                const r = await AsyncStorage.getItem('@user_role');
                if (token) setUserToken(token);
                if (r) setRole(r);
            } catch (e) {
                console.warn('Failed to load auth', e);
            }
        })();
    }, []);

    const setAuth = async (token: string, roleVal: string) => {
        setUserToken(token);
        setRole(roleVal);
        await AsyncStorage.setItem('@user_token', token);
        await AsyncStorage.setItem('@user_role', roleVal);
    };

    const logout = async () => {
        setUserToken(null);
        setRole(null);
        await AsyncStorage.removeItem('@user_token');
        await AsyncStorage.removeItem('@user_role');
    };

    return (
        <AuthContext.Provider value={{ userToken, role, setAuth, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { loadUserFromStorage, logoutUser } from '../../features/auth/slices/authSlice';

type AuthContextType = {
    isAuthenticated: boolean;
    userToken: string | null;
    userId: string | null;
    role: string | null;
    isHydrating: boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const { user, accessToken } = useAppSelector((state) => state.auth);

    const [isHydrating, setIsHydrating] = useState(true);

    // Hydrate user session from AsyncStorage via Redux
    useEffect(() => {
        (async () => {
            try {
                setIsHydrating(true);
                await dispatch(loadUserFromStorage());
            } finally {
                setIsHydrating(false);
            }
        })();
    }, [dispatch]);

    const logout = () => {
        dispatch(logoutUser());
    };

    const isAuthenticated = !!user && !!accessToken;

    const value: AuthContextType = {
        isAuthenticated,
        userToken: accessToken,
        userId: user?.id || null,
        role: user?.role || null,
        isHydrating,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

import { UserRole } from '../../features/auth/types';
import { clearAuthState, loadAuthState, persistAuthState } from '../storage/authStorage';

type AuthContextType = {
    userToken: string | null;
    role: UserRole | null;
    userId: string | null;
    setAuth: (token: string, role: UserRole, userId: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isHydrating: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const hydrateAuthState = async () => {
            setIsHydrating(true);
            try {
                const persisted = await loadAuthState();
                if (!isMounted) {
                    return;
                }

                setUserToken(persisted.token);
                setRole(persisted.role);
                setUserId(persisted.userId);
            } finally {
                if (isMounted) {
                    setIsHydrating(false);
                }
            }
        };

        hydrateAuthState();

        return () => {
            isMounted = false;
        };
    }, []);

    const setAuth = async (token: string, roleValue: UserRole, id: string) => {
        setUserToken(token);
        setRole(roleValue);
        setUserId(id);
        await persistAuthState(token, roleValue, id);
    };

    const logout = async () => {
        setUserToken(null);
        setRole(null);
        setUserId(null);
        await clearAuthState();
    };

    const value = useMemo(
        () => ({
            userToken,
            role,
            userId,
            setAuth,
            logout,
            isAuthenticated: Boolean(userToken),
            isHydrating,
        }),
        [userToken, role, userId, isHydrating],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

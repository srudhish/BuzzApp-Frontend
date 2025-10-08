import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
    userToken: string | null;
    setUserToken: (token: string | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);

    const logout = () => {
        setUserToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                setUserToken,
                isAuthenticated: !!userToken,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
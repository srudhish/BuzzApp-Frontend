import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../app/context/AuthContext';
import DashboardScreen from '../features/dashboard/screens/DashboardScreen';
import ProfileScreen from '../features/auth/screens/ProfileScreen';
import { getCurrentUser } from '../features/auth/services/authService';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';

const Stack = createNativeStackNavigator();

type CurrentUserResponse = {
    isProfileCompleted?: boolean;
};

const AppNavigator = () => {
    const { userToken, userId, isAuthenticated, isHydrating } = useAuth();
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);

    useEffect(() => {
        if (isHydrating) {
            return;
        }

        if (!userToken || !userId) {
            setLoadingProfile(false);
            setIsProfileComplete(false);
            return;
        }

        let isMounted = true;

        const checkProfile = async () => {
            setLoadingProfile(true);
            try {
                const user = await getCurrentUser<CurrentUserResponse>(userToken, userId);
                if (isMounted) {
                    setIsProfileComplete(Boolean(user?.isProfileCompleted));
                }
            } catch (err) {
                console.error('Failed to load current user', err);
                if (isMounted) {
                    setIsProfileComplete(false);
                }
            } finally {
                if (isMounted) {
                    setLoadingProfile(false);
                }
            }
        };

        checkProfile();

        return () => {
            isMounted = false;
        };
    }, [isHydrating, userToken, userId]);

    if (isHydrating || loadingProfile) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    isProfileComplete ? (
                        <Stack.Screen name="Dashboard" component={DashboardScreen} />
                    ) : (
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                    )
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

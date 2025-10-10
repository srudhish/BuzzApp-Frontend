import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import DashboardScreen from "../features/dashboard/screens/DashboardScreen";
import ProfileScreen from "../features/auth/screens/ProfileScreen";
import { useAuth } from "../app/context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { getCurrentUser } from "../features/auth/services/authService";
import LoginScreen from "../features/auth/screens/LoginScreen";
import SignupScreen from "../features/auth/screens/SignupScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { userToken, userId, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);

    useEffect(() => {
        if (!userToken || !userId) {
            setLoading(false);
            return;
        }

        const checkProfile = async () => {
            try {
                setLoading(true);
                const user = await getCurrentUser(userToken, userId);

                // Assuming `isProfileCompleted` is true when profile is complete
                setIsProfileComplete(user.isProfileCompleted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        checkProfile();
    }, [userToken, userId]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isAuthenticated ? (
                    isProfileComplete ? (
                        // Navigate to Dashboard if profile is complete
                        <Stack.Screen name="Dashboard" component={DashboardScreen} />
                    ) : (
                        // Navigate to ProfileScreen if profile is not complete
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

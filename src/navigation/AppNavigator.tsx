import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../features/auth/screens/LoginScreen";
import DashboardScreen from "../features/dashboard/screens/DashboardScreen";
import { useAppSelector } from "../app/store";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { accessToken } = useAppSelector(state => state.auth);
    const isAuthenticated = !!accessToken;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="Dashboard" component={DashboardScreen} />
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
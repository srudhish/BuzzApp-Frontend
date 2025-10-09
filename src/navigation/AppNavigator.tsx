// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import DashboardScreen from '../features/dashboard/screens/DashboardScreen';
// optionally split dashboard by role
import { useAuth } from '../app/context/AuthContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const auth = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!auth.isAuthenticated ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="OwnerDashboard" component={DashboardScreen} />
                        <Stack.Screen name="EmployeeDashboard" component={DashboardScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
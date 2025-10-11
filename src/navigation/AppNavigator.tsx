import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../app/context/AuthContext';
import { getCurrentUser } from '../features/auth/services/authService';
import { UserRole } from '../features/auth/types';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import CompanyDashboard from '../features/company/screens/CompanyDashboard';
import EmployeeDashboard from '../features/employee/screens/EmployeeDashboard';
import CompanyProfile from '../features/company/screens/CompanyProfile';
import EmployeeProfile from '../features/employee/screens/EmployeeProfile';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const Stack = createNativeStackNavigator();

type CurrentUserResponse = {
  isProfileCompleted?: boolean;
};

const AppNavigator = () => {
  const { isAuthenticated, userToken, userId, role, isHydrating } = useAuth();
  const [checking, setChecking] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState<boolean | null>(null);

  useAuthRedirect();

  useEffect(() => {
    const checkProfile = async () => {
      if (!isAuthenticated || !userToken || !userId) {
        setIsProfileCompleted(null);
        return;
      }
      try {
        setChecking(true);
        const user = await getCurrentUser<CurrentUserResponse>(userToken, userId);
        setIsProfileCompleted(Boolean(user?.isProfileCompleted));
      } catch {
        setIsProfileCompleted(false);
      } finally {
        setChecking(false);
      }
    };

    checkProfile();
  }, [isAuthenticated, userToken, userId]);

  if (isHydrating || checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isCompanyRole =
    role === UserRole.Owner || role === UserRole.Supplier || role === UserRole.Buyer;
  const isEmployeeRole =
    role === UserRole.Employee || role === UserRole.Supervisor || role === UserRole.Labor;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : isProfileCompleted === false ? (
        <>
          {isCompanyRole && <Stack.Screen name="CompanyProfile" component={CompanyProfile} />}
          {isEmployeeRole && <Stack.Screen name="EmployeeProfile" component={EmployeeProfile} />}
        </>
      ) : (
        <>
          {isCompanyRole && <Stack.Screen name="CompanyDashboard" component={CompanyDashboard} />}
          {isEmployeeRole && <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />}
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

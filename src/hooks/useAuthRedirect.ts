import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../app/context/AuthContext';
import { UserRole } from '../features/auth/types';

/**
 * Handles role-based automatic navigation when authentication or role changes.
 */
export const useAuthRedirect = () => {
    const navigation = useNavigation<any>();
    const { isAuthenticated, role, isHydrating } = useAuth();

    useEffect(() => {
        if (isHydrating) return; // wait until hydration completes

        if (!isAuthenticated) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            return;
        }

        switch (role) {
            case UserRole.Owner:
            case UserRole.Supplier:
            case UserRole.Buyer:
                navigation.reset({ index: 0, routes: [{ name: 'CompanyDashboard' }] });
                break;

            case UserRole.Employee:
            case UserRole.Supervisor:
            case UserRole.Labor:
                navigation.reset({ index: 0, routes: [{ name: 'EmployeeDashboard' }] });
                break;

            default:
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                break;
        }
    }, [isAuthenticated, role, isHydrating, navigation]);
};

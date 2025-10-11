import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';

import { useAuth } from '../../../app/context/AuthContext';
import { getCurrentUser, submitProfile } from '../services/authService';
import ProfileForm from './ProfileForm';
import { UserProfileResponse, UserProfileUpdateDto, UserRole } from '../types';

const ProfileScreen: React.FC = () => {
    const { userToken, role, userId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<(UserProfileUpdateDto & { Id: string }) | null>(null);

    useEffect(() => {
        if (!userToken || !userId) {
            return;
        }

        let isMounted = true;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const user = await getCurrentUser<UserProfileResponse>(userToken, userId);
                if (!isMounted) {
                    return;
                }

                setInitialData({
                    Id: user.id,
                    FullName: user.fullName ?? '',
                    Email: user.email ?? '',
                    Aadhaar: user.aadharNumber ?? '',
                    Role: role ?? user.role ?? UserRole.Employee,
                    CompanyName: user.company?.name ?? '',
                    CompanyAddress: user.company?.address ?? '',
                    CompanyGST: user.company?.gstNumber ?? '',
                    EmployeeProfile: user.employeeProfile,
                });
            } catch (err: any) {
                console.error('Failed to fetch profile', err);
                if (isMounted) {
                    Alert.alert('Error', err.message || 'Could not load profile');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, [role, userId, userToken]);

    const handleSubmit = async (data: UserProfileUpdateDto) => {
        if (!userToken || !initialData) {
            return;
        }

        setLoading(true);
        try {
            const response = await submitProfile(initialData.Id, data, userToken);
            Alert.alert('Success', response.message || 'Profile updated successfully!');
        } catch (err: any) {
            console.error('Failed to submit profile', err);
            Alert.alert('Error', err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !initialData) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    if (!initialData) {
        return null;
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <ProfileForm
                userRole={role ?? initialData.Role}
                userId={initialData.Id}
                initialData={initialData}
                onSubmit={handleSubmit}
            />
            {loading && <ActivityIndicator size="small" />}
        </ScrollView>
    );
};

export default ProfileScreen;

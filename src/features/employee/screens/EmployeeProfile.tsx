import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Alert, View } from 'react-native';
import EmployeeProfileForm from '../../profile/components/profileform/employeeProfileForm';
import { submitProfile, getCurrentUser } from '../../auth/services/authService';
import { useAuth } from '../../../app/context/AuthContext';
import { UserProfileUpdateDto } from '../../auth/types';

const EmployeeProfile: React.FC = () => {
    const { userToken, userId } = useAuth();
    const [initialData, setInitialData] = useState<UserProfileUpdateDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!userToken || !userId) return;
            try {
                const data = await getCurrentUser<UserProfileUpdateDto>(userToken, userId);
                setInitialData(data);
            } catch (err: any) {
                Alert.alert('Error', err.message || 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userToken, userId]);

    const handleSubmit = async (data: UserProfileUpdateDto) => {
        if (!userToken || !userId) return;
        try {
            setLoading(true);
            await submitProfile(userId, data, userToken);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <EmployeeProfileForm initialData={initialData} onSubmit={handleSubmit} />
        </ScrollView>
    );
};

export default EmployeeProfile;

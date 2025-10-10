import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, ActivityIndicator } from "react-native";
import ProfileForm from "./ProfileForm";
import { useAuth } from "../../../app/context/AuthContext";
import { submitProfile } from "../services/authService";
import { UserProfileUpdateDto, UserRole } from "../types";
import { getCurrentUser } from "../services/authService";

const ProfileScreen: React.FC = () => {
    const { userToken, role, userId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<UserProfileUpdateDto & { Id: string } | null>(null);

    useEffect(() => {
        if (!userToken || !userId) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const user = await getCurrentUser(userToken, userId);

                setInitialData({
                    Id: user.id,
                    FullName: user.fullName || "",
                    Email: user.email || "",
                    Aadhaar: user.aadharNumber || "",
                    Role: (role ?? UserRole) as UserRole,
                    CompanyName: user.company?.name || "",
                    CompanyAddress: user.company?.address || "",
                    CompanyGST: user.company?.gstNumber || "",
                    EmployeeProfile: user.employeeProfile || undefined,
                });
            } catch (err: any) {
                console.error(err);
                Alert.alert("Error", err.message || "Could not load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userToken, userId]);

    const handleSubmit = async (data: UserProfileUpdateDto) => {
        if (!userToken || !initialData) return;

        setLoading(true);
        try {
            const res = await submitProfile(initialData.Id, data, userToken);
            Alert.alert("Success", res.message || "Profile updated successfully!");
        } catch (err: any) {
            console.error(err);
            Alert.alert("Error", err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading || !initialData) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <ProfileForm
                userRole={role || UserRole.Employee}
                userId={initialData.Id}
                initialData={initialData}
                onSubmit={handleSubmit}
            />
            {loading && <ActivityIndicator size="small" />}
        </ScrollView>
    );
};

export default ProfileScreen;

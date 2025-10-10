import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { UserProfileUpdateDto, EmployeeProfileDto, UserRole } from '../types';

interface Props {
    userRole: UserRole;
    userId: string;
    initialData?: UserProfileUpdateDto;
    onSubmit: (data: UserProfileUpdateDto) => void;
}

const ProfileForm: React.FC<Props> = ({ userRole, initialData, onSubmit }) => {
    const [fullName, setFullName] = useState(initialData?.FullName || '');
    const [email, setEmail] = useState(initialData?.Email || '');
    const [aadhaar, setAadhaar] = useState(initialData?.Aadhaar || '');

    // Company fields
    const [companyName, setCompanyName] = useState(initialData?.CompanyName || '');
    const [companyAddress, setCompanyAddress] = useState(initialData?.CompanyAddress || '');
    const [companyGST, setCompanyGST] = useState(initialData?.CompanyGST || '');

    // Employee fields
    const [employeeCode, setEmployeeCode] = useState(initialData?.EmployeeProfile?.EmployeeCode || '');
    const [designation, setDesignation] = useState(initialData?.EmployeeProfile?.Designation || '');
    const [department, setDepartment] = useState(initialData?.EmployeeProfile?.Department || '');
    const [reportingToId, setReportingToId] = useState(initialData?.EmployeeProfile?.ReportingToId || '');

    const handleSubmit = () => {
        const isCompanyRole = userRole === UserRole.Owner || userRole === UserRole.Supplier || userRole === UserRole.Buyer;
        const isEmployeeRole = userRole === UserRole.Employee || userRole === UserRole.Supervisor || userRole === UserRole.Labor;

        const data: UserProfileUpdateDto = {
            FullName: fullName,
            Email: email,
            Aadhaar: aadhaar,
            Role: userRole,
            CompanyName: isCompanyRole ? companyName : undefined,
            CompanyAddress: isCompanyRole ? companyAddress : undefined,
            CompanyGST: isCompanyRole ? companyGST : undefined,
            EmployeeProfile: isEmployeeRole ? {
                EmployeeCode: employeeCode,
                Designation: designation,
                Department: department,
                ReportingToId: reportingToId || undefined
            } : undefined
        };

        onSubmit(data);
    };

    return (
        <View>
            <Text>Full Name</Text>
            <TextInput value={fullName} onChangeText={setFullName} />

            <Text>Email</Text>
            <TextInput value={email} onChangeText={setEmail} />

            <Text>Aadhaar</Text>
            <TextInput value={aadhaar} onChangeText={setAadhaar} />

            {(userRole === UserRole.Owner || userRole === UserRole.Supplier || userRole === UserRole.Buyer) && (
                <>
                    <Text>Company Name</Text>
                    <TextInput value={companyName} onChangeText={setCompanyName} />

                    <Text>Company Address</Text>
                    <TextInput value={companyAddress} onChangeText={setCompanyAddress} />

                    <Text>GST Number</Text>
                    <TextInput value={companyGST} onChangeText={setCompanyGST} />
                </>
            )}

            {(userRole === UserRole.Employee || userRole === UserRole.Supervisor || userRole === UserRole.Labor) && (
                <>
                    <Text>Employee Code</Text>
                    <TextInput value={employeeCode} onChangeText={setEmployeeCode} />

                    <Text>Designation</Text>
                    <TextInput value={designation} onChangeText={setDesignation} />

                    <Text>Department</Text>
                    <TextInput value={department} onChangeText={setDepartment} />

                    <Text>Reporting To (User ID)</Text>
                    <TextInput value={reportingToId} onChangeText={setReportingToId} />
                </>
            )}

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default ProfileForm;
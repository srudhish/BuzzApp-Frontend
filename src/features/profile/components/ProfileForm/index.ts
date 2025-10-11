import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import CompanyProfileForm from './CompanyProfileForm';
import EmployeeProfileForm from './EmployeeProfileForm';

const ProfileForm = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.role?.toLowerCase();

    if (role === 'owner' || role === 'supplier' || role === 'buyer') {
        return <CompanyProfileForm />;
    }

    if (role === 'supervisor' || role === 'labor') {
        return <EmployeeProfileForm />;
    }

    return null; // default fallback
};

export default ProfileForm;
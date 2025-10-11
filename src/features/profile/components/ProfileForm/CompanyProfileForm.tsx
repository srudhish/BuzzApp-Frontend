import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { styles } from './styles';

const CompanyProfileForm = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Company Profile</Text>

            <Text style={styles.label}>Company Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter company name"
                value={user?.companyName || ''}
                editable={false}
            />

            <Text style={styles.label}>Business Type</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Supplier, Buyer"
                value={user?.role || ''}
                editable={false}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Company Email"
                value={user?.email || ''}
                editable={false}
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput
                style={styles.input}
                placeholder="Contact number"
                value={user?.phoneNumber || ''}
                editable={false}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                placeholder="Company Address"
                value={user?.address || ''}
                editable={false}
            />
        </View>
    );
};

export default CompanyProfileForm;
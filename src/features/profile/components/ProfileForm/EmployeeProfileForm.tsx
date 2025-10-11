import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { styles } from './styles';

const EmployeeProfileForm = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Employee Profile</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Employee name"
                value={user?.fullName || ''}
                editable={false}
            />

            <Text style={styles.label}>Designation</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Supervisor / Labor"
                value={user?.role || ''}
                editable={false}
            />

            <Text style={styles.label}>Employee ID</Text>
            <TextInput
                style={styles.input}
                placeholder="Employee ID"
                value={user?.employeeId || ''}
                editable={false}
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={user?.phoneNumber || ''}
                editable={false}
            />

            <Text style={styles.label}>Supervisor</Text>
            <TextInput
                style={styles.input}
                placeholder="Supervisor Name"
                value={user?.supervisorName || ''}
                editable={false}
            />
        </View>
    );
};

export default EmployeeProfileForm;
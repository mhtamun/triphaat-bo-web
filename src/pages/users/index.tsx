import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getRoles } from '../../apis';
import { IField } from '../../components/global/GenericFormGenerator';
import { getSeverity, getUserStatusOptions } from '../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'User Management | Admin Panel | TripHaat');

export const getUserManagementFields = (roles: { id: number; name: string }[], isVendor: boolean = false): IField[] => [
    {
        type: 'text',
        name: 'name',
        placeholder: 'Enter a name!',
        title: 'Name (Full name)',
        initialValue: null,
        validate: (values: any) => {
            if (!values.name) return 'Required!';

            return null;
        },
    },
    {
        type: 'email',
        name: 'email',
        placeholder: 'Enter an email!',
        title: 'Email',
        initialValue: null,
        validate: (values: any) => {
            if (!values.email) return 'Required!';

            return null;
        },
    },
    {
        type: 'password',
        name: 'password',
        placeholder: 'Enter a password!',
        title: 'Password',
        initialValue: null,
        validate: (values: any) => {
            if (!values.password) return 'Required!';

            return null;
        },
    },
    {
        type: 'select-sync',
        name: 'roleId',
        placeholder: 'Select a role!',
        title: 'Role',
        initialValue: null,
        options: _.map(roles, (role: { id: number; name: string }) => ({
            value: role.id,
            label: role.name,
        })),
        validate: (values: any) => {
            if (!values.roleId) return 'Required!';

            return null;
        },
    },
    {
        type: 'text',
        name: 'phone',
        placeholder: 'Enter a phone number',
        title: 'Phone Number',
        initialValue: null,
    },
    {
        type: 'text',
        name: 'nid',
        placeholder: 'Enter national identification number',
        title: 'NID',
        initialValue: null,
    },
    {
        type: 'text',
        name: 'address',
        placeholder: 'Enter an address',
        title: 'Address',
        initialValue: null,
    },
    {
        type: 'select-sync',
        name: 'status',
        placeholder: 'Select a status!',
        title: 'Status',
        initialValue: 'ACTIVE',
        options: !isVendor
            ? getUserStatusOptions()
            : [
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'BLOCKED', label: 'BLOCKED' },
              ],
        validate: (values: any) => {
            if (!values.status) return 'Status required!';

            return null;
        },
    },
];

const Page = () => {
    const [roles, setRoles] = useState<{ id: number; name: string }[] | null>(null);

    useEffect(() => {
        getRoles()
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                } else if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setRoles(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});
    }, []);

    return (
        <Card>
            {useMemo(
                () =>
                    !roles ? null : (
                        <GenericViewGenerator
                            name={'User'}
                            title="Users"
                            subtitle="Manage user here!"
                            viewAll={{
                                uri: `/api/v1/users`,
                                ignoredColumns: [
                                    'id',
                                    'password',
                                    'otp',
                                    'otpAttemptCount',
                                    'roleId',
                                    'createdAt',
                                    'updatedAt',
                                ],
                                scopedColumns: {
                                    status: (item: any) => (
                                        <Badge
                                            value={item.status}
                                            size="normal"
                                            severity={getSeverity(item.status)}
                                        ></Badge>
                                    ),
                                },
                                actionIdentifier: 'id',
                                onDataModify: data =>
                                    _.map(data, datum => ({
                                        ...datum,
                                        role: datum.role.name,
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/users`,
                            }}
                            viewOne={{ uri: '/api/v1/users/{id}', identifier: '{id}' }}
                            editExisting={{ uri: '/api/v1/users/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/users/{id}',
                                identifier: '{id}',
                            }}
                            fields={getUserManagementFields(roles).filter(field => field.name !== 'status')}
                            editFields={getUserManagementFields(roles)
                                .filter(field => field.name !== 'password')
                                .map(field => (field.name !== 'email' ? { ...field } : { ...field, isDisabled: true }))}
                        />
                    ),
                [roles]
            )}
        </Card>
    );
};

export default Page;

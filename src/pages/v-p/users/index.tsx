import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';

export const roles = [
    { value: 2, label: 'Super Admin' },
    { value: 3, label: 'Admin' },
    { value: 4, label: 'Trip Manager' },
];

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'User Management', () => {
        return {
            isVendor: true,
        };
    });

const Page = () => {
    const fields = [
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
            type: 'hidden',
            name: 'type',
            placeholder: '',
            title: '',
            initialValue: 'VENDOR_ADMIN',
            validate: (values: any) => {
                if (!values.type) return 'Required!';

                return null;
            },
        },
        {
            type: 'select-sync',
            name: 'roleId',
            placeholder: 'Select a role!',
            title: 'Role',
            initialValue: null,
            options: roles,
            validate: (values: any) => {
                if (!values.roleId) return 'Required!';

                return null;
            },
        },
        {
            type: 'text',
            name: 'phone',
            placeholder: 'Enter a phone number!',
            title: 'Phone Number',
            initialValue: null,
            validate: (values: any) => {
                if (!values.phone) return 'Required!';

                if (values.phone && !values.phone.startsWith('+880')) return 'Please enter code +88 before number!';

                return null;
            },
        },
        {
            type: 'text',
            name: 'nid',
            placeholder: 'Enter NID!',
            title: 'NID',
            initialValue: null,
            validate: (values: any) => {
                if (!values.nid) return 'Required!';

                return null;
            },
        },
    ];

    return (
        <>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'User'}
                        title="Users"
                        subtitle="Manage user here!"
                        viewAll={{
                            uri: `/vendor/api/v1/users`,
                            ignoredColumns: [
                                'id',
                                'password',
                                'type',
                                'otp',
                                'otpAttempt',
                                'roleId',
                                'createdAt',
                                'updatedAt',
                            ],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    role: datum.role.name,
                                })),
                        }}
                        addNew={{
                            uri: `/vendor/api/v1/users`,
                        }}
                        viewOne={{ uri: '/vendor/api/v1/users/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/vendor/api/v1/users/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/vendor/api/v1/users/{id}',
                            identifier: '{id}',
                        }}
                        fields={fields}
                        editFields={fields.filter(
                            field => field.name !== 'email' && field.name !== 'password' && field.name !== 'type'
                        )}
                    />
                ),
                [roles]
            )}
        </>
    );
};

export default Page;

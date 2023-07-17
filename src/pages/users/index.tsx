import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getRoles } from '../../apis';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context);

const Page = () => {
    const [roles, setRoles] = useState(null);

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
            initialValue: 'ADMIN',
            validate: (values: any) => {
                if (!values.type) return 'Name required!';

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
                            uri: `/api/v1/users`,
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
                            uri: `/api/v1/users`,
                        }}
                        viewOne={{ uri: '/api/v1/users/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/users/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/users/{id}',
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

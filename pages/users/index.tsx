import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getRoles } from '../../api';

export const getServerSideProps: GetServerSideProps = async (context) => getAuthorized(context);

const Page = () => {
    const [roles, setRoles] = useState(null);

    useEffect(() => {
        getRoles()
            .then((response) => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                }

                if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setRoles(response.data);
                }
            })
            .catch((error) => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});
    }, []);

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
                                'otp',
                                'otpCount',
                                'roleId',
                                'createdAt',
                                'updatedAt',
                                'isDeleted',
                            ],
                            actionIdentifier: 'id',
                            onDataModify: (data) =>
                                _.map(data, (datum) => ({
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
                        fields={[
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
                        ]}
                    />
                ),
                [roles]
            )}
        </>
    );
};

export default Page;

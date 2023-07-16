import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async (context) => getAuthorized(context);

const Page = () => {
    const router = useRouter();

    return (
        <>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'role'}
                        title="Roles"
                        subtitle="Manage role here!"
                        viewAll={{
                            uri: `/api/v1/roles`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt', 'isDeleted'],
                            actionIdentifier: 'id',
                            onDataModify: (data) =>
                                _.map(data, (datum) => ({
                                    ...datum,
                                    permissions: null,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/roles`,
                        }}
                        viewOne={{ uri: '/api/v1/roles/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/roles/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/roles/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.ARROW_RIGHT,
                                text: 'Permissions',
                                callback: (identifier) => {
                                    router.push(`/roles/${identifier}/permissions`);
                                },
                            },
                        ]}
                        fields={[
                            {
                                type: 'text',
                                name: 'name',
                                placeholder: 'Enter a name!',
                                title: 'Role Name',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.name) return 'Name required!';

                                    return null;
                                },
                            },
                        ]}
                    />
                ),
                []
            )}
        </>
    );
};

export default Page;

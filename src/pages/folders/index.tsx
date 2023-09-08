import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../utils';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context, 'Folder Management');

const Page = () => {
    const router = useRouter();

    return (
        <Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'folder'}
                        title="Folders"
                        subtitle="Manage folder here!"
                        viewAll={{
                            uri: `/api/v1/folders`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/folders`,
                        }}
                        viewOne={{ uri: '/api/v1/folders/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/folders/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/folders/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.FILE,
                                text: 'Files',
                                callback: identifier => {
                                    router.push(`/folders/${identifier}/files`);
                                },
                            },
                        ]}
                        fields={[
                            {
                                type: 'text',
                                name: 'name',
                                placeholder: 'Enter a name!',
                                title: 'Folder Name',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.name) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'status',
                                placeholder: 'Select status!',
                                title: 'Status',
                                initialValue: 'ACTIVE',
                                options: getGeneralStatusOptions(),
                                validate: (values: any) => {
                                    if (!values.status) return 'Required!';

                                    return null;
                                },
                            },
                        ]}
                    />
                ),
                []
            )}
        </Card>
    );
};

export default Page;

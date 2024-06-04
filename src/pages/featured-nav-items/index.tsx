import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../utils';

export const getNavItemFields = () => [
    {
        type: 'text',
        name: 'href',
        placeholder: 'Enter url',
        title: 'HREF URL',
        initialValue: null,
        validate: (values: any) => {
            if (!values.href) return 'Required!';

            return null;
        },
    },
    {
        type: 'text',
        name: 'name',
        placeholder: 'Enter service name',
        title: 'Name',
        initialValue: null,
        validate: (values: any) => {
            if (!values.name) return 'Required!';

            return null;
        },
    },
    {
        type: 'number',
        name: 'serial',
        placeholder: 'Enter a serial!',
        title: 'Serial',
        initialValue: 9999,
        validate: (values: any) => {
            if (!values.serial) return 'Serial required!';

            return null;
        },
    },
    {
        type: 'select-sync',
        name: 'status',
        placeholder: 'Select a status!',
        title: 'Status',
        initialValue: 'ACTIVE',
        options: getGeneralStatusOptions(),
        validate: (values: any) => {
            if (!values.status) return 'Status required!';

            return null;
        },
    },
];

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured Nav Item Management | Admin Panel | TripHaat');

const Page = () => {
    const router = useRouter();

    return (
        <Card title="" subTitle="">
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Featured Navigation Item'}
                        title={'Featured Navigation Item'}
                        subtitle={'Manage featured navigation items here!'}
                        viewAll={{
                            uri: `/api/v1/featured-nav-items`,
                            ignoredColumns: ['_id', '__v', 'createdAt', 'updatedAt'],
                            actionIdentifier: '_id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    children: null,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/featured-nav-items`,
                        }}
                        viewOne={{ uri: '/api/v1/featured-nav-items/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/featured-nav-items/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/featured-nav-items/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.ARROW_RIGHT,
                                text: 'Sub Items',
                                callback: identifier => {
                                    router.push(`/featured-nav-items/${identifier}`);
                                },
                            },
                        ]}
                        fields={getNavItemFields()}
                    />
                ),
                []
            )}
        </Card>
    );
};

export default Page;

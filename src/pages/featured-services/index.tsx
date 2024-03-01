import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured Service Management | Admin Panel | TripHaat', cookies => {
        return null;
    });

const Page = () => {
    return (
        <Card title="" subTitle="">
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Featured Service'}
                        title={'Featured Services'}
                        subtitle={'Manage featured services here!'}
                        viewAll={{
                            uri: `/api/v1/featured-services`,
                            ignoredColumns: ['_id', '__v', 'createdAt', 'updatedAt'],
                            actionIdentifier: '_id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/featured-services`,
                        }}
                        viewOne={{ uri: '/api/v1/featured-services/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/featured-services/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/featured-services/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[]}
                        fields={[
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
                                name: 'imageUrl',
                                placeholder: 'Enter image url',
                                title: 'Image Url',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.imageUrl) return 'Required!';

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
                        ]}
                    />
                ),
                []
            )}
        </Card>
    );
};

export default Page;

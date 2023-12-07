import React, { useMemo, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured Trip Management', () => {
        return null;
    });

const Page = () => {
    const router = useRouter();

    return (
        <Card title="" subTitle="">
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Featured Trip'}
                        title={'Featured Trips'}
                        subtitle={'Manage featured-trips here!'}
                        viewAll={{
                            uri: `/api/v1/sliders`,
                            ignoredColumns: ['_id', '__v', 'createdAt', 'updatedAt'],
                            actionIdentifier: '_id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/featured-trips`,
                        }}
                        viewOne={{ uri: '/api/v1/featured-trips/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/featured-trips/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/featured-trips/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[]}
                        fields={[
                            {
                                type: 'select-async',
                                name: 'testParent',
                                placeholder: 'Search',
                                title: '',
                                initialValue: null,
                                options: [],
                                loadOptions: searchKey => {
                                    console.debug({ searchKey });
                                },
                                isSearchable: true,
                                validate(values) {
                                    if (!values.testParent) return 'Required';

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

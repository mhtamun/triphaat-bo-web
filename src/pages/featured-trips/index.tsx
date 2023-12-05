import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured Trip Management', cookies => {
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
                                type: 'select-sync',
                                name: 'testParent',
                                placeholder: '',
                                title: '',
                                initialValue: null,
                                options: [
                                    {
                                        value: 1,
                                        label: 'One',
                                    },
                                    {
                                        value: 2,
                                        label: 'Two',
                                    },
                                ],
                            },
                            {
                                type: 'select-sync',
                                name: 'testChild',
                                placeholder: '',
                                title: '',
                                initialValue: null,
                                options: [
                                    {
                                        parentValue: 1,
                                        value: 1,
                                        label: 'One One',
                                    },
                                    {
                                        parentValue: 1,
                                        value: 2,
                                        label: 'One Two',
                                    },
                                    {
                                        parentValue: 2,
                                        value: 1,
                                        label: 'Two One',
                                    },
                                    {
                                        parentValue: 2,
                                        value: 2,
                                        label: 'Two Two',
                                    },
                                ],
                                parentFieldName: 'testParent',
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

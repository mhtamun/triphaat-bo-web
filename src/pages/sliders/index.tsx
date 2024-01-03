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

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Slider Management | Admin Panel | TripHaat', cookies => {
        return null;
    });

const Page = () => {
    const router = useRouter();

    return (
        <Card title="" subTitle="">
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Slider'}
                        title={'Sliders'}
                        subtitle={'Manage sliders here!'}
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
                            uri: `/api/v1/sliders`,
                        }}
                        viewOne={{ uri: '/api/v1/sliders/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/sliders/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/sliders/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[]}
                        fields={[
                            {
                                type: 'text',
                                name: 'header',
                                placeholder: 'Enter header!',
                                title: 'Header',
                                initialValue: null,
                            },{
                                type: 'text',
                                name: 'subheader',
                                placeholder: 'Enter subheader!',
                                title: 'Subheader',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'subheaderOneIcon',
                                placeholder: '',
                                title: 'Subheader One Icon',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'subheaderOneText',
                                placeholder: '',
                                title: 'Subheader One Text',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'subheaderTwoIcon',
                                placeholder: '',
                                title: 'Subheader Two Icon',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'subheaderTwoText',
                                placeholder: '',
                                title: 'Subheader Two Text',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'alt',
                                placeholder: 'Enter alt for image!',
                                title: 'ALT',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'src',
                                placeholder: 'Enter URL for image!',
                                title: 'SRC',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.src) return 'Required!';

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

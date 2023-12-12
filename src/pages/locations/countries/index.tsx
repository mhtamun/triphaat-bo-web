import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Country Management | Admin Panel | TripHaat', cookies => {
        return null;
    });

const Page = () => {
    const router = useRouter();

    return (
        <Card title="" subTitle="">
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Country'}
                        title={'Countries'}
                        subtitle={'Manage countries here!'}
                        viewAll={{
                            uri: `/api/v1/countries`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/countries`,
                        }}
                        viewOne={{ uri: '/api/v1/countries/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/countries/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/countries/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.ARROW_RIGHT,
                                text: 'States',
                                callback: identifier => {
                                    router.push(`/locations/countries/${identifier}/states`);
                                },
                            },
                        ]}
                        fields={[
                            {
                                type: 'text',
                                name: 'name',
                                placeholder: 'Enter country name!',
                                title: 'Name',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.name) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'isoCode',
                                placeholder: 'Enter country ISO code!',
                                title: 'ISO Code',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.isoCode) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'countryCode',
                                placeholder: 'Enter country code!',
                                title: 'Country Code',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.countryCode) return 'Required!';

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

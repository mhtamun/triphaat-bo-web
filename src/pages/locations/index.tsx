import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import { getCityById } from '../../apis';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Location Management | Admin Panel | TripHaat');

const Page = () => {
    const router = useRouter();

    return (
        <Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Location'}
                        title={'Locations'}
                        subtitle={'Manage locations here!'}
                        viewAll={{
                            uri: `/api/v1/locations`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: (data: any[]) =>
                                _.map(data, datum => ({
                                    id: datum.id,
                                    name: datum.name,
                                    city: datum?.city?.name,
                                    state: datum?.city?.state?.name,
                                    country: datum?.city?.state?.country?.name,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/locations`,
                        }}
                        viewOne={{ uri: '/api/v1/locations/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/locations/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/locations/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
                            {
                                type: 'text',
                                name: 'name',
                                placeholder: 'Enter location name!',
                                title: 'Name',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.name) return 'Required!';

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

import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../../libs/auth';
import { getCityById } from '../../../../../../../apis';
import GenericViewGenerator from '../../../../../../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Location Management', async cookies => {
        const id: string = context.query.id as string;

        const response = await getCityById(id, `${cookies.accessType} ${cookies.accessToken}`);

        if (!response || response.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            city: response.data,
        };
    });

const Page = ({
    city,
}: {
    city: {
        id: number;
        stateId: number;
        name: string;
    };
}) => {
    const router = useRouter();

    return (
        <>
            <Button
                label="Back"
                icon={PrimeIcons.ARROW_LEFT}
                severity="info"
                className="mb-3"
                onClick={e => {
                    e.preventDefault();

                    router.push(`/locations/countries/states/${city.stateId}/cities`);
                }}
            />
            <Card title={city.name} subTitle="City">
                {useMemo(
                    () => (
                        <GenericViewGenerator
                            name={'Location'}
                            title={'Locations'}
                            subtitle={'Manage locations here!'}
                            viewAll={{
                                uri: `/api/v1/cities/${city.id}/locations`,
                                ignoredColumns: ['id', 'cityId', 'createdAt', 'updatedAt'],
                                actionIdentifier: 'id',
                                onDataModify: data =>
                                    _.map(data, datum => ({
                                        ...datum,
                                        city: datum.city.name,
                                        state: datum.city.state.name,
                                        country: datum.city.state.country.name,
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
                                    type: 'hidden',
                                    name: 'cityId',
                                    placeholder: '',
                                    title: '',
                                    initialValue: city.id,
                                    validate: (values: any) => {
                                        if (!values.cityId) return 'Required!';

                                        return null;
                                    },
                                },
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
        </>
    );
};

export default Page;

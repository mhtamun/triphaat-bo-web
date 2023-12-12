import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import { getStateById } from '../../../../../../apis';
import GenericViewGenerator from '../../../../../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'State Management | Admin Panel | TripHaat', async cookies => {
        const id: string = context.query.id as string;

        const response = await getStateById(id, `${cookies.accessType} ${cookies.accessToken}`);

        if (!response || response.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            state: response.data,
        };
    });

const Page = ({
    state,
}: {
    state: {
        id: number;
        countryId: number;
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

                    router.push(`/locations/countries/${state.countryId}/states`);
                }}
            />
            <Card title={state.name} subTitle="State">
                {useMemo(
                    () => (
                        <GenericViewGenerator
                            name={'City'}
                            title={'Cities'}
                            subtitle={'Manage cities here!'}
                            viewAll={{
                                uri: `/api/v1/states/${state.id}/cities`,
                                ignoredColumns: ['id', 'stateId', 'createdAt', 'updatedAt'],
                                actionIdentifier: 'id',
                                onDataModify: data =>
                                    _.map(data, datum => ({
                                        ...datum,
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/cities`,
                            }}
                            viewOne={{ uri: '/api/v1/cities/{id}', identifier: '{id}' }}
                            editExisting={{ uri: '/api/v1/cities/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/cities/{id}',
                                identifier: '{id}',
                            }}
                            customActions={[
                                {
                                    color: 'info',
                                    icon: PrimeIcons.ARROW_RIGHT,
                                    text: 'Locations',
                                    callback: identifier => {
                                        router.push(`/locations/countries/states/cities/${identifier}/locations`);
                                    },
                                },
                            ]}
                            fields={[
                                {
                                    type: 'hidden',
                                    name: 'stateId',
                                    placeholder: '',
                                    title: '',
                                    initialValue: state.id,
                                    validate: (values: any) => {
                                        if (!values.stateId) return 'Required!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'text',
                                    name: 'name',
                                    placeholder: 'Enter city name!',
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

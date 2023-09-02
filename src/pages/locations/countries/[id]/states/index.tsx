import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../libs/auth';
import { getCountryById } from '../../../../../apis';
import GenericViewGenerator from '../../../../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'State Management | Location Management', async cookies => {
        const id: string = context.query.id as string;

        const response = await getCountryById(id, `${cookies.accessType} ${cookies.accessToken}`);

        if (!response || response.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            country: response.data,
        };
    });

const Page = ({
    country,
}: {
    country: {
        id: number;
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

                    router.push(`/locations/countries/`);
                }}
            />
            <Card title={country.name} subTitle="Country">
                {useMemo(
                    () => (
                        <GenericViewGenerator
                            name={'State'}
                            title={'States'}
                            subtitle={'Manage states here!'}
                            viewAll={{
                                uri: `/api/v1/countries/${country.id}/states`,
                                ignoredColumns: ['id', 'countryId', 'createdAt', 'updatedAt'],
                                actionIdentifier: 'id',
                                onDataModify: data =>
                                    _.map(data, datum => ({
                                        ...datum,
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/states`,
                            }}
                            viewOne={{ uri: '/api/v1/states/{id}', identifier: '{id}' }}
                            editExisting={{ uri: '/api/v1/states/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/states/{id}',
                                identifier: '{id}',
                            }}
                            customActions={[
                                {
                                    color: 'info',
                                    icon: PrimeIcons.ARROW_RIGHT,
                                    text: 'Cities',
                                    callback: identifier => {
                                        router.push(`/locations/countries/states/${identifier}/cities`);
                                    },
                                },
                            ]}
                            fields={[
                                {
                                    type: 'hidden',
                                    name: 'countryId',
                                    placeholder: '',
                                    title: '',
                                    initialValue: country.id,
                                    validate: (values: any) => {
                                        if (!values.countryId) return 'Required!';

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

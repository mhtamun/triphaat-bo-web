import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getVendorStatusOptions } from '../../utils';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context, 'Client Management');

const Page = () => {
    const router = useRouter();

    return (
        <Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Client'}
                        title="Clients"
                        subtitle="Manage clients here!"
                        viewAll={{
                            uri: `/api/v1/clients`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            scopedColumns: {
                                status: (item: any) => (
                                    <>
                                        <Badge
                                            value={item.status}
                                            size="large"
                                            severity={item.status === 'BANNED' ? 'danger' : 'success'}
                                        ></Badge>
                                    </>
                                ),
                            },
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    id: datum.id,
                                    slug: datum.slug,
                                    name: datum.businessName,
                                    phone: datum.countryCode + '' + datum.phoneNumber,
                                    status: datum.status,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/clients`,
                        }}
                        viewOne={{
                            uri: '/api/v1/clients/{id}',
                            identifier: '{id}',
                            onDataModify: datum => ({
                                ...datum,
                            }),
                        }}
                        editExisting={{ uri: '/api/v1/clients/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/clients/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[
                            {
                                color: 'success',
                                icon: PrimeIcons.LIST,
                                text: 'Itinerary List',
                                callback: identifier => {
                                    router.push(`/clients/${identifier}/itineraries`);
                                },
                            },
                            {
                                color: 'success',
                                icon: PrimeIcons.PLUS_CIRCLE,
                                text: 'Itinerary Create',
                                callback: identifier => {
                                    router.push(`/clients/${identifier}/itineraries/create`);
                                },
                            },
                        ]}
                        fields={[
                            {
                                type: 'text',
                                name: 'businessName',
                                placeholder: 'Enter business name!',
                                title: 'Business Name',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.businessName) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'phone',
                                placeholder: 'Enter a phone number!',
                                title: 'Phone Number',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.phone) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'status',
                                placeholder: 'Select status!',
                                title: 'Status',
                                initialValue: 'PERMITTED',
                                options: getVendorStatusOptions(),
                                validate: (values: any) => {
                                    if (!values.status) return 'Required!';

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

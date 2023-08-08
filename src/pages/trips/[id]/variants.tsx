import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';
import { getTrip } from '../../../apis';
import { getGeneralStatusOptions } from '../../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Variants | Trip Management', async cookies => {
        const tripId = context.query.id;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const responseGetTrip = await getTrip(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetTrip || responseGetTrip.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/errors/500',
                    permanent: false,
                },
            };
        }

        return {
            tripId,
            trip: responseGetTrip.data,
        };
    });

const Page = ({ tripId, trip }: { tripId: string; trip: any }) => {
    const router = useRouter();

    return (
        <>
            <Card title={trip?.name} className="mb-3">
                <TabView
                    activeIndex={1}
                    onTabChange={e => {
                        if (e.index === 0) router.push(`/trips/${tripId}`);
                        // if (e.index === 1) router.push(`/trips/${tripId}/variants`);
                        if (e.index === 2) router.push(`/trips/${tripId}/images`);
                        if (e.index === 3) router.push(`/trips/${tripId}/videos`);
                        if (e.index === 4) router.push(`/trips/${tripId}/tags`);
                    }}
                >
                    <TabPanel header="Details"></TabPanel>
                    <TabPanel header="Variants">
                        {useMemo(
                            () => (
                                <GenericViewGenerator
                                    name={'Variant'}
                                    title="Trip Variants"
                                    subtitle="Manage trip variants here!"
                                    viewAll={{
                                        uri: `/api/v1/trips/${tripId}/variants`,
                                        ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                        actionIdentifier: 'id',
                                        onDataModify: data =>
                                            _.map(data, datum => ({
                                                ...datum,
                                            })),
                                    }}
                                    addNew={{
                                        uri: `/api/v1/variants`,
                                        buttonText: 'Add Variant',
                                    }}
                                    viewOne={{ uri: '/api/v1/variants/{id}', identifier: '{id}' }}
                                    editExisting={{ uri: '/api/v1/variants/{id}', identifier: '{id}' }}
                                    removeOne={{
                                        uri: '/api/v1/variants/{id}',
                                        identifier: '{id}',
                                    }}
                                    fields={[
                                        {
                                            type: 'hidden',
                                            name: 'tripId',
                                            placeholder: '',
                                            title: '',
                                            initialValue: parseInt(tripId),
                                            validate: (values: any) => {
                                                if (!values.tripId) return 'Required!';

                                                return null;
                                            },
                                        },
                                        {
                                            type: 'text',
                                            name: 'reasons',
                                            placeholder: 'Enter reasons for this variant!',
                                            title: 'Reasons',
                                            initialValue: null,
                                            validate: (values: any) => {
                                                if (!values.reasons) return 'Required!';

                                                return null;
                                            },
                                        },
                                        {
                                            type: 'number',
                                            name: 'costPrice',
                                            placeholder: 'Enter cost price!',
                                            title: 'Cost Price',
                                            initialValue: null,
                                            validate: (values: any) => {
                                                if (!values.costPrice) return 'Required!';

                                                return null;
                                            },
                                        },
                                        {
                                            type: 'number',
                                            name: 'price',
                                            placeholder: 'Enter price!',
                                            title: 'Price',
                                            initialValue: null,
                                            validate: (values: any) => {
                                                if (!values.price) return 'Required!';

                                                return null;
                                            },
                                        },
                                        {
                                            type: 'number',
                                            name: 'offerPrice',
                                            placeholder: 'Enter offer price!',
                                            title: 'Offer Price',
                                            initialValue: null,
                                        },
                                        {
                                            type: 'select-sync',
                                            name: 'status',
                                            placeholder: 'Select status!',
                                            title: 'Status',
                                            initialValue: 'ACTIVE',
                                            options: getGeneralStatusOptions(),
                                            validate: (values: any) => {
                                                if (!values.status) return 'Required!';

                                                return null;
                                            },
                                        },
                                    ]}
                                />
                            ),
                            [trip]
                        )}
                    </TabPanel>
                    <TabPanel header="Images"></TabPanel>
                    <TabPanel header="Videos"></TabPanel>
                    <TabPanel header="Tags"></TabPanel>
                </TabView>
            </Card>
        </>
    );
};

export default Page;

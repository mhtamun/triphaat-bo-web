import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericViewGenerator from '../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../apis';
import { getGeneralStatusOptions } from '../../../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Tags | Trip Management', async cookies => {
        const tripId = context.query.id;

        // @ts-ignore
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetTrip || responseGetTrip.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/errors/500',
                    permanent: false,
                },
            };
        }

        return {
            isVendor: true,
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
                    activeIndex={4}
                    onTabChange={e => {
                        if (e.index === 0) router.push(`/v-p/trips/${tripId}`);
                        if (e.index === 1) router.push(`/v-p/trips/${tripId}/variants`);
                        if (e.index === 2) router.push(`/v-p/trips/${tripId}/images`);
                        if (e.index === 3) router.push(`/v-p/trips/${tripId}/videos`);
                        if (e.index === 4) router.push(`/v-p/trips/${tripId}/tags`);
                        if (e.index === 5) router.push(`/v-p/trips/${tripId}/travelers`);
                        if (e.index === 6) router.push(`/v-p/trips/${tripId}/payments`);
                    }}
                >
                    <TabPanel header="Details"></TabPanel>
                    <TabPanel header="Variants"></TabPanel>
                    <TabPanel header="Images"></TabPanel>
                    <TabPanel header="Videos"></TabPanel>
                    <TabPanel header="Tags">
                        {useMemo(
                            () => (
                                <GenericViewGenerator
                                    name={'Tag'}
                                    title="Trip Tags"
                                    subtitle="Manage trip tags here!"
                                    viewAll={{
                                        uri: `/api/v1/trips/${tripId}/tags`,
                                        ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                        actionIdentifier: 'id',
                                        onDataModify: data =>
                                            _.map(data, datum => ({
                                                ...datum,
                                            })),
                                    }}
                                    addNew={{
                                        uri: `/api/v1/tags`,
                                        buttonText: 'Add Tag',
                                    }}
                                    viewOne={{ uri: '/api/v1/tags/{id}', identifier: '{id}' }}
                                    editExisting={{ uri: '/api/v1/tags/{id}', identifier: '{id}' }}
                                    removeOne={{
                                        uri: '/api/v1/tags/{id}',
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
                                            name: 'tag',
                                            placeholder: 'Enter a TAG for this trip!',
                                            title: 'TAG',
                                            initialValue: null,
                                            validate: (values: any) => {
                                                if (!values.tag) return 'Required!';

                                                return null;
                                            },
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
                    <TabPanel header="Travelers"></TabPanel>
                    <TabPanel header="Payments"></TabPanel>
                </TabView>
            </Card>
        </>
    );
};

export default Page;

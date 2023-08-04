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
    getAuthorized(context, 'Images | Trip Management', async cookies => {
        const tripId = context.query.id;

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
            <Card title={trip?.name}>
                <TabView
                    activeIndex={5}
                    onTabChange={e => {
                        if (e.index === 0) router.push(`/v-p/trips/${tripId}`);
                        if (e.index === 1) router.push(`/v-p/trips/${tripId}/variants`);
                        if (e.index === 2) router.push(`/v-p/trips/${tripId}/images`);
                        if (e.index === 3) router.push(`/v-p/trips/${tripId}/videos`);
                        if (e.index === 4) router.push(`/v-p/trips/${tripId}/tags`);
                        if (e.index === 5) router.push(`/v-p/trips/${tripId}/travelers`);
                    }}
                >
                    <TabPanel header="Details"></TabPanel>
                    <TabPanel header="Variants"></TabPanel>
                    <TabPanel header="Images"></TabPanel>
                    <TabPanel header="Videos"></TabPanel>
                    <TabPanel header="Tags"></TabPanel>
                    <TabPanel header="Travelers">
                        {useMemo(
                            () => (
                                <GenericViewGenerator
                                    name={'Traveller'}
                                    title="Trip Travelers"
                                    subtitle="Manage trip travelers here!"
                                    viewAll={{
                                        uri: `/vendor/api/v1/trips/${tripId}/trip-travelers`,
                                        ignoredColumns: [
                                            'id',
                                            'vendorId',
                                            'tripId',
                                            'travellerId',
                                            'createdAt',
                                            'updatedAt',
                                        ],
                                        actionIdentifier: 'id',
                                        onDataModify: data =>
                                            _.map(data, datum => ({
                                                ...datum,
                                            })),
                                    }}
                                    addNew={{
                                        uri: `/vendor/api/v1/trip-travelers`,
                                        buttonText: 'Add Tag',
                                    }}
                                    viewOne={{ uri: '/vendor/api/v1/trip-travelers/{id}', identifier: '{id}' }}
                                    editExisting={{ uri: '/vendor/api/v1/trip-travelers/{id}', identifier: '{id}' }}
                                    removeOne={{
                                        uri: '/vendor/api/v1/trip-travelers/{id}',
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
                                            name: 'firstName',
                                            placeholder: 'Enter first name this traveller!',
                                            title: 'First Name',
                                            initialValue: null,
                                            validate: (values: any) => {
                                                if (!values.firstName) return 'Required!';

                                                return null;
                                            },
                                        },
                                        {
                                            type: 'text',
                                            name: 'lastName',
                                            placeholder: 'Enter last name this traveller!',
                                            title: 'Last Name',
                                            initialValue: null,
                                            validate: (values: any) => {
                                                if (!values.lastName) return 'Required!';

                                                return null;
                                            },
                                        },
                                    ]}
                                />
                            ),
                            [trip]
                        )}
                    </TabPanel>
                </TabView>
            </Card>
        </>
    );
};

export default Page;

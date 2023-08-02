import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericFormGenerator from '../../../../components/global/GenericFormGenerator';
import { getLocationsForVendor, getTripForVendor } from '../../../../apis';
import { callPutApi } from '../../../../libs/api';
import { ILocation } from '../../../trips/create';
import { getTripFields } from '../create';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Details | Trip Management', async cookies => {
        const tripId = context.query.id;

        const responseGetLocations = await getLocationsForVendor();
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (
            !responseGetLocations ||
            responseGetLocations.statusCode !== 200 ||
            !responseGetTrip ||
            responseGetTrip.statusCode !== 200
        ) {
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
            locations: responseGetLocations.data,
            trip: responseGetTrip.data,
        };
    });

const Page = ({ tripId, locations, trip }: { tripId: string; locations: ILocation[]; trip: any }) => {
    const router = useRouter();

    return (
        <>
            <Card title={trip?.name} className="mb-3">
                <TabView
                    activeIndex={0}
                    onTabChange={e => {
                        if (e.index === 0) router.push(`/v/trips/${tripId}`);
                        if (e.index === 1) router.push(`/v/trips/${tripId}/variants`);
                        if (e.index === 2) router.push(`/v/trips/${tripId}/images`);
                        if (e.index === 3) router.push(`/v/trips/${tripId}/videos`);
                        if (e.index === 4) router.push(`/v/trips/${tripId}/tags`);
                    }}
                >
                    <TabPanel header="Details">
                        {useMemo(
                            () =>
                                !locations || _.size(locations) === 0 || !trip ? null : (
                                    <GenericFormGenerator
                                        datum={{
                                            ...trip,
                                            startDate: trip.startDate.split('T')[0],
                                            endDate: trip.endDate.split('T')[0],
                                        }}
                                        fields={getTripFields(locations)}
                                        callback={data => {
                                            // console.debug({ data });

                                            callPutApi('/vendor/api/v1/trips/' + tripId, data)
                                                .then(response => {
                                                    if (!response) {
                                                        // showToast('error', 'Unsuccessful!', 'Server not working!');
                                                    } else if (response.statusCode !== 200) {
                                                        // showToast('error', 'Unsuccessful!', response.message);
                                                    } else {
                                                        // showToast('success', 'Success!', response.message);
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error('error', error);

                                                    // showToast('error', 'Unsuccessful!', 'Something went wrong!');
                                                })
                                                .finally(() => {});
                                        }}
                                        submitButtonText="Save"
                                    />
                                ),
                            [trip]
                        )}
                    </TabPanel>
                    <TabPanel header="Variants"></TabPanel>
                    <TabPanel header="Images"></TabPanel>
                    <TabPanel header="Videos"></TabPanel>
                    <TabPanel header="Tags"></TabPanel>
                </TabView>
            </Card>
        </>
    );
};

export default Page;

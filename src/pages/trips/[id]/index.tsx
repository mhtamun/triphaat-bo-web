import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericFormGenerator from '../../../components/global/GenericFormGenerator';
import { getLocations, getTrip, getVendors } from '../../../apis';
import { callPutApi } from '../../../libs/api';
import { ILocation, IVendor, getTripFields } from '../create';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Details | Trip Management', async cookies => {
        const tripId = context.query.id;

        const responseGetVendors = await getVendors(`${cookies.accessType} ${cookies.accessToken}`);
        const responseGetLocations = await getLocations(`${cookies.accessType} ${cookies.accessToken}`);
        const responseGetTrip = await getTrip(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (
            !responseGetVendors ||
            responseGetVendors.statusCode !== 200 ||
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
            tripId,
            vendors: responseGetVendors.data,
            locations: responseGetLocations.data,
            trip: responseGetTrip.data,
        };
    });

const Page = ({
    tripId,
    vendors,
    locations,
    trip,
}: {
    tripId: string;
    vendors: IVendor[];
    locations: ILocation[];
    trip: any;
}) => {
    const router = useRouter();

    return (
        <>
            <Card title={trip?.name} className="mb-3">
                <TabView
                    activeIndex={0}
                    onTabChange={e => {
                        // if (e.index === 0) router.push(`/trips/${tripId}`);
                        if (e.index === 1) router.push(`/trips/${tripId}/variants`);
                        if (e.index === 2) router.push(`/trips/${tripId}/images`);
                        if (e.index === 3) router.push(`/trips/${tripId}/videos`);
                        if (e.index === 4) router.push(`/trips/${tripId}/tags`);
                    }}
                >
                    <TabPanel header="Details">
                        {useMemo(
                            () =>
                                !vendors ||
                                _.size(vendors) === 0 ||
                                !locations ||
                                _.size(locations) === 0 ||
                                !trip ? null : (
                                    <GenericFormGenerator
                                        datum={{
                                            ...trip,
                                            startDate: trip.startDate.split('T')[0],
                                            endDate: trip.endDate.split('T')[0],
                                        }}
                                        fields={getTripFields(vendors, locations)}
                                        callback={(data, callback) => {
                                            // console.debug({ data });

                                            callPutApi('/api/v1/trips/' + tripId, data)
                                                .then(response => {
                                                    if (!response) {
                                                        // showToast('error', 'Unsuccessful!', 'Server not working!');
                                                    } else if (response.statusCode !== 200) {
                                                        // showToast('error', 'Unsuccessful!', response.message);
                                                    } else {
                                                        // callback();
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

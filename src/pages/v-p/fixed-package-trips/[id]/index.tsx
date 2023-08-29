import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericFormGenerator from '../../../../components/global/GenericFormGenerator';
import { getLocationsForVendor, getTripForVendor } from '../../../../apis';
import { callPutApi } from '../../../../libs/api';
import { getTripFields } from '../create';
import TabViewComponent from '../../../../components/trips/TabViewComponent';

export interface ILocation {
    id: number;
    name: string;
    city: {
        name: string;
        state: {
            name: string;
            country: {
                name: string;
            };
        };
    };
}

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Details | Trip Management', async cookies => {
        const tripId = context.query.id;

        const responseGetLocations = await getLocationsForVendor();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (
            !responseGetLocations ||
            responseGetLocations.statusCode !== 200 ||
            !responseGetTrip ||
            responseGetTrip.statusCode !== 200
        ) {
            return {
                redirect: {
                    destination: '/500',
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
            <Card title={trip?.name}>
                <Button
                    className="btn-block mb-3"
                    icon="pi pi-plus"
                    label={'New Booking'}
                    severity="success"
                    raised
                    onClick={e => {
                        e.preventDefault();

                        router.push('/v-p/fixed-package-trips/' + tripId + '/booking');
                    }}
                />

                <TabViewComponent
                    activeIndex={0}
                    router={router}
                    tripId={tripId}
                    content={useMemo(
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
                />
            </Card>
        </>
    );
};

export default Page;

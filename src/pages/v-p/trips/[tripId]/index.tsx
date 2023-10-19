import React, { useMemo } from 'react';

// third-party libraries
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import _ from 'lodash';

// application libraries
import { getAuthorized } from '../../../../libs/auth';
import GenericFormGenerator from '../../../../components/global/GenericFormGenerator';
import { getLocations, getTripForVendor } from '../../../../apis';
import { callPutApi } from '../../../../libs/api';
import { getTripFields } from '../type/[type]/create';
import TabViewComponent from '../../../../components/trips/TabViewComponent';
import WrapperComponent from '../../../../components/trips/WrapperComponent';

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
        const tripId = context.query.tripId;

        const responseGetLocations = await getLocations(`${cookies.accessType} ${cookies.accessToken}`);
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

    console.debug({
        startDate: trip.startDate,
        endDate: trip.endDate,
        expiryDateOfBooking: trip.expiryDateOfBooking,
    });

    return (
        <WrapperComponent tripId={tripId} title={trip?.name} router={router}>
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
        </WrapperComponent>
    );
};

export default Page;

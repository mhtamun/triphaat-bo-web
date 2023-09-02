import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericViewGenerator from '../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../apis';
import TabViewComponent from '../../../../components/trips/TabViewComponent';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Images | Trip Management', async cookies => {
        const tripId = context.query.id;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetTrip || responseGetTrip.statusCode !== 200) {
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
            trip: responseGetTrip.data,
        };
    });

const Page = ({ tripId, trip }: { tripId: string; trip: any }) => {
    const router = useRouter();

    return (
        <>
            <Card title={trip?.name}>
                <TabViewComponent
                    activeIndex={8}
                    router={router}
                    tripId={tripId}
                    content={useMemo(
                        () => (
                            <GenericViewGenerator
                                name={'Traveler'}
                                title="Trip Travelers"
                                subtitle="Manage trip travelers here!"
                                viewAll={{
                                    uri: `/vendor/api/v1/trips/${tripId}/trip-travelers`,
                                    ignoredColumns: [
                                        'id',
                                        'vendorId',
                                        'tripId',
                                        'travelerId',
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
                                        placeholder: 'Enter first name this traveler!',
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
                                        placeholder: 'Enter last name this traveler!',
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
                />
            </Card>
        </>
    );
};

export default Page;

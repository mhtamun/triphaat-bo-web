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
import { getGeneralStatusOptions } from '../../../../utils';
import TabViewComponent from '../../../../components/trips/TabViewComponent';
import WrapperComponent from '../../../../components/trips/WrapperComponent';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Itinerary | Trip Management', async cookies => {
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
        <WrapperComponent tripId={tripId} title={trip?.name} router={router}>
            <TabViewComponent
                activeIndex={7}
                router={router}
                tripId={tripId}
                content={useMemo(
                    () => (
                        <GenericViewGenerator
                            name={'Itinerary'}
                            title="Trip Itinerary"
                            subtitle="Manage trip itinerary here!"
                            viewAll={{
                                uri: `/api/v1/trips/${tripId}/itinerary`,
                                ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                actionIdentifier: 'id',
                                onDataModify: data =>
                                    _.map(data, datum => ({
                                        ...datum,
                                        locations: _.map(datum.locations, location => location + ', '),
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/itinerary`,
                                buttonText: 'Add Itinerary',
                            }}
                            viewOne={{ uri: '/api/v1/itinerary/{id}', identifier: '{id}' }}
                            editExisting={{ uri: '/api/v1/itinerary/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/itinerary/{id}',
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
                                    type: 'number',
                                    name: 'day',
                                    placeholder: 'Enter day number',
                                    title: 'Day',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.day) return 'Required!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'text',
                                    name: 'title',
                                    placeholder: 'Enter title for this activity!',
                                    title: 'Title',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.title) return 'Required!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'text',
                                    name: 'body',
                                    placeholder: 'Enter body for itinerary',
                                    title: 'Body (Description)',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.body) return 'Required!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'chips',
                                    name: 'locations',
                                    placeholder: 'Enter locations for this activity!',
                                    title: 'Locations (Enter multiple if required)',
                                    initialValue: null,
                                },
                                {
                                    type: 'chips',
                                    name: 'activities',
                                    placeholder: 'Enter activities',
                                    title: 'Activities (Description)',
                                    initialValue: null,
                                },
                                {
                                    type: 'chips',
                                    name: 'meals',
                                    placeholder: 'Enter meals description for itinerary',
                                    title: 'Meals (Description)',
                                    initialValue: null,
                                },
                                {
                                    type: 'number',
                                    name: 'serial',
                                    placeholder: 'Enter serial number for sorting!',
                                    title: 'Serial',
                                    initialValue: 9999,
                                    validate: (values: any) => {
                                        if (!values.serial) return 'Required!';

                                        return null;
                                    },
                                    col: 2,
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
            />
        </WrapperComponent>
    );
};

export default Page;

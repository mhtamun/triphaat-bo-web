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

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Activities | Trip Management', async cookies => {
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
                    activeIndex={6}
                    router={router}
                    tripId={tripId}
                    content={useMemo(
                        () => (
                            <GenericViewGenerator
                                name={'Activity'}
                                title="Trip Activities"
                                subtitle="Manage trip activities here!"
                                viewAll={{
                                    uri: `/api/v1/trips/${tripId}/activities`,
                                    ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                    actionIdentifier: 'id',
                                    onDataModify: data =>
                                        _.map(data, datum => ({
                                            ...datum,
                                            locations: _.map(datum.locations, location => location + ', '),
                                        })),
                                }}
                                addNew={{
                                    uri: `/api/v1/activities`,
                                    buttonText: 'Add Activity',
                                }}
                                viewOne={{ uri: '/api/v1/activities/{id}', identifier: '{id}' }}
                                editExisting={{ uri: '/api/v1/activities/{id}', identifier: '{id}' }}
                                removeOne={{
                                    uri: '/api/v1/activities/{id}',
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
                                        name: 'imageUrl',
                                        placeholder: 'Enter image URL for this activity!',
                                        title: 'Image URL',
                                        initialValue: null,
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
                                        placeholder: 'Enter body for this activity!',
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
                                        type: 'number',
                                        name: 'serial',
                                        placeholder: 'Enter serial number for sorting!',
                                        title: 'Serial',
                                        initialValue: 9999,
                                        validate: (values: any) => {
                                            if (!values.serial) return 'Required!';

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
                />
            </Card>
        </>
    );
};

export default Page;

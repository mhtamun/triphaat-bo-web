import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import GenericViewGenerator from '../../../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../../../apis';
import { getGeneralStatusOptions } from '../../../../../../utils';
import TabViewComponent from '../../../../../../components/trips/TabViewComponent';
import WrapperComponent from '../../../../../../components/trips/WrapperComponent';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Includes/Excludes | Trip Management', async cookies => {
        const tripId = context.query.tripId;

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
                router={router}
                tripId={tripId}
                content={useMemo(
                    () => (
                        <GenericViewGenerator
                            name={'Include/Exclude'}
                            title="Trip Include/Exclude List"
                            subtitle="Manage trip include/exclude here!"
                            viewAll={{
                                uri: `/api/v1/trips/${tripId}/includes`,
                                ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                scopedColumns: {
                                    status: (item: any) => (
                                        <>
                                            <Badge
                                                value={item.status}
                                                size="large"
                                                severity={item.status === 'INACTIVE' ? 'danger' : 'success'}
                                            ></Badge>
                                        </>
                                    ),
                                },
                                actionIdentifier: 'id',
                                onDataModify: data =>
                                    _.map(data, datum => ({
                                        id: datum.id,
                                        note: datum.note,
                                        type: !datum.not ? 'Include' : 'Exclude',
                                        status: datum.status,
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/includes`,
                                buttonText: 'Add Include/Exclude',
                            }}
                            viewOne={{ uri: '/api/v1/includes/{id}', identifier: '{id}' }}
                            editExisting={{ uri: '/api/v1/includes/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/includes/{id}',
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
                                    name: 'note',
                                    placeholder: 'Enter a include/exclude note for this trip!',
                                    title: 'Note',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.note) return 'Required!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'select-sync',
                                    name: 'not',
                                    placeholder: 'Select include/exclude!',
                                    title: 'Include/Exclude',
                                    initialValue: false,
                                    options: [
                                        {
                                            value: false,
                                            label: 'Include',
                                        },
                                        { value: true, label: 'Exclude' },
                                    ],
                                    validate: (values: any) => {
                                        if (values.not === null || values.not === undefined) return 'Required!';

                                        return null;
                                    },
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

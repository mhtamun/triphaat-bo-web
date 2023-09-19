import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericViewGenerator from '../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../apis';
import { getGeneralStatusOptions } from '../../../../utils';
import TabViewComponent from '../../../../components/trips/TabViewComponent';
import WrapperComponent from '../../../../components/trips/WrapperComponent';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Images | Trip Management', async cookies => {
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
                activeIndex={2}
                router={router}
                tripId={tripId}
                content={useMemo(
                    () => (
                        <GenericViewGenerator
                            name={'Image'}
                            title="Trip Images"
                            subtitle="Manage trip images here!"
                            viewAll={{
                                uri: `/api/v1/trips/${tripId}/images`,
                                ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                scopedColumns: {
                                    url: (item: any) => (
                                        <>
                                            <span className="p-column-title">{item.title}</span>
                                            <img src={item.url} alt={item.title} className="shadow-2" width="100" />
                                        </>
                                    ),
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
                                        ...datum,
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/images`,
                                buttonText: 'Add Image',
                            }}
                            viewOne={{ uri: '/api/v1/images/{id}', identifier: '{id}' }}
                            editExisting={{ uri: '/api/v1/images/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/images/{id}',
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
                                    name: 'url',
                                    placeholder: 'Enter image URL for this trip!',
                                    title: 'URL',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.url) return 'Required!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'text',
                                    name: 'title',
                                    placeholder: 'Enter title for this image!',
                                    title: 'Title',
                                    initialValue: null,
                                },
                                {
                                    type: 'text',
                                    name: 'description',
                                    placeholder: 'Enter description for this image!',
                                    title: 'Description',
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

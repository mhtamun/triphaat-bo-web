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
    getAuthorized(context, 'Variants | Trip Management', async cookies => {
        const tripId = context.query.id;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
            <Card title={trip?.name} className="mb-3">
                <TabViewComponent
                    activeIndex={1}
                    router={router}
                    tripId={tripId}
                    content={useMemo(
                        () => (
                            <GenericViewGenerator
                                name={'Variant'}
                                title="Trip Variants"
                                subtitle="Manage trip variants here!"
                                viewAll={{
                                    uri: `/api/v1/trips/${tripId}/variants`,
                                    ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                    actionIdentifier: 'id',
                                    onDataModify: data =>
                                        _.map(data, datum => ({
                                            ...datum,
                                        })),
                                }}
                                addNew={{
                                    uri: `/api/v1/variants`,
                                    buttonText: 'Add Variant',
                                }}
                                viewOne={{ uri: '/api/v1/variants/{id}', identifier: '{id}' }}
                                editExisting={{ uri: '/api/v1/variants/{id}', identifier: '{id}' }}
                                removeOne={{
                                    uri: '/api/v1/variants/{id}',
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
                                        name: 'reasons',
                                        placeholder: 'Enter reasons for this variant!',
                                        title: 'Reasons',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.reasons) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'number',
                                        name: 'costPrice',
                                        placeholder: 'Enter cost price!',
                                        title: 'Cost Price',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.costPrice) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'number',
                                        name: 'price',
                                        placeholder: 'Enter price!',
                                        title: 'Price',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.price) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'number',
                                        name: 'offerPrice',
                                        placeholder: 'Enter offer price!',
                                        title: 'Offer Price',
                                        initialValue: null,
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

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
    getAuthorized(context, 'FAQs | Trip Management', async cookies => {
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
            <Card title={trip?.name} className="mb-3">
                <TabViewComponent
                    activeIndex={7}
                    router={router}
                    tripId={tripId}
                    content={useMemo(
                        () => (
                            <GenericViewGenerator
                                name={'FAQ'}
                                title="Trip FAQs"
                                subtitle="Manage trip faqs here!"
                                viewAll={{
                                    uri: `/api/v1/trips/${tripId}/faqs`,
                                    ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                    actionIdentifier: 'id',
                                    onDataModify: data =>
                                        _.map(data, datum => ({
                                            ...datum,
                                        })),
                                }}
                                addNew={{
                                    uri: `/api/v1/faqs`,
                                    buttonText: 'Add FAQ',
                                }}
                                viewOne={{ uri: '/api/v1/faqs/{id}', identifier: '{id}' }}
                                editExisting={{ uri: '/api/v1/faqs/{id}', identifier: '{id}' }}
                                removeOne={{
                                    uri: '/api/v1/faqs/{id}',
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
                                        name: 'question',
                                        placeholder: 'Enter a question for this FAQ!',
                                        title: 'Question',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.question) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'answer',
                                        placeholder: 'Enter a answer for this FAQ!',
                                        title: 'Answer',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.answer) return 'Required!';

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

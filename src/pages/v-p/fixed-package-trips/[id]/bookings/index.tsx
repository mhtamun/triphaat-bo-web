import React from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../libs/auth';
import GenericViewGenerator from '../../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../../apis';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Tags | Trip Management', async cookies => {
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
        <Card>
            <GenericViewGenerator
                name="Booking List"
                viewAll={{
                    uri: `/api/v1/trips/${tripId}/tags`,
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
                }}
            />
        </Card>
    );
};

export default Page;

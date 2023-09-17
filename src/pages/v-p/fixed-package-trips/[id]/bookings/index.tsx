import React from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Badge } from 'primereact/badge';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../libs/auth';
import GenericViewGenerator from '../../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../../apis';
import WrapperComponent from '../../../../../components/trips/WrapperComponent';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Bookings | Trip Management', async cookies => {
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
        <WrapperComponent tripId={tripId} title={'Bookings: ' + trip?.name} router={router}>
            <GenericViewGenerator
                name="Booking List"
                viewAll={{
                    uri: `/vendor/api/v1/trips/${tripId}/trip-bookings`,
                    ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                    scopedColumns: {
                        status: (item: any) => (
                            <>
                                <Badge
                                    value={item.status}
                                    size="large"
                                    severity={
                                        item.status === 'LOCKED' || item.status === 'PENDING' ? 'warning' : 'success'
                                    }
                                ></Badge>
                            </>
                        ),
                    },
                    actionIdentifier: 'id',
                    onDataModify: data =>
                        _.map(data, datum => ({
                            customerName: datum.customer?.firstName + ' ' + datum.customer?.lastName,
                            pricePerPerson: datum.pricePerPerson,
                            numberOfTraveler: datum.numberOfTraveler,
                            status: datum.booking?.status,
                        })),
                }}
                customActions={[
                    {
                        color: 'info',
                        icon: PrimeIcons.ARROW_RIGHT,
                        text: 'Invoice',
                        callback: identifier => {
                            router.push(``);
                        },
                    },
                ]}
            />
        </WrapperComponent>
    );
};

export default Page;

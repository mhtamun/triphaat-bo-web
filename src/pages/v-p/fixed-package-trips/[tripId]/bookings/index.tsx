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
import { getSeverity } from '../../../../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Bookings | Trip Management', async cookies => {
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
        <WrapperComponent tripId={tripId} title={'Bookings: ' + trip?.name} router={router}>
            <GenericViewGenerator
                name="Booking List"
                viewAll={{
                    uri: `/vendor/api/v1/trips/${tripId}/trip-booking-payments`,
                    ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                    scopedColumns: {
                        paymentStatus: (item: any) => (
                            <>
                                <Badge
                                    value={item.paymentStatus}
                                    size="normal"
                                    severity={getSeverity(item.paymentStatus)}
                                ></Badge>
                            </>
                        ),
                        bookingStatus: (item: any) => (
                            <>
                                <Badge
                                    value={item.bookingStatus}
                                    size="normal"
                                    severity={getSeverity(item.bookingStatus)}
                                ></Badge>
                            </>
                        ),
                    },
                    actionIdentifier: 'id',
                    onDataModify: data =>
                        _.map(data, datum => ({
                            id: datum.id,
                            customerName:
                                datum.tripBooking?.customer?.firstName + ' ' + datum.tripBooking?.customer?.lastName,
                            pricePerPerson: datum.tripBooking?.pricePerPerson,
                            numberOfTravelers: datum.tripBooking?.numberOfTravelers,
                            totalAmount: datum.amount,
                            paymentStatus: datum.status,
                            bookingStatus: datum.tripBooking?.booking?.status,
                        })),
                }}
                customActions={[
                    {
                        color: 'info',
                        icon: PrimeIcons.ARROW_RIGHT,
                        text: 'Invoice',
                        callback: identifier => {
                            router.push(`/v-p/fixed-package-trips/${tripId}/bookings/${identifier}/invoice`);
                        },
                    },
                ]}
            />
        </WrapperComponent>
    );
};

export default Page;

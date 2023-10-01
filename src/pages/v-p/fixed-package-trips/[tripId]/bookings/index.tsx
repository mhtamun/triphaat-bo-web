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
import { generateQueryPath, getBookingStatusOptions, getPaymentStatusOptions, getSeverity } from '../../../../../utils';
import FilterComponent from '../../../../../components/global/Filter';
import PaginatorComponent from '../../../../../components/global/Paginator';

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
    console.debug({ router });

    return (
        <WrapperComponent tripId={tripId} title={'Bookings: ' + trip?.name} router={router}>
            <GenericViewGenerator
                name="Booking List"
                viewAll={{
                    uri: `/vendor/api/v1/trips/${tripId}/trip-booking-payments${generateQueryPath(
                        '',
                        { tripId: router.query.tripId },
                        router.query
                    )}`,
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
                filtration={
                    <FilterComponent
                        fields={[
                            {
                                type: 'text',
                                name: 'search',
                                placeholder: 'Search by name...',
                                title: 'Search',
                                initialValue: null,
                            },
                            {
                                type: 'date',
                                name: 'startDate',
                                placeholder: 'Enter start date for date range filter...',
                                title: 'Date Range (Start Date)',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.startDate && values.endDate)
                                        return 'Please select both date for range!';

                                    return null;
                                },
                                col: 2,
                            },
                            {
                                type: 'date',
                                name: 'endDate',
                                placeholder: 'Enter start date for date range filter...',
                                title: 'Date Range (End Date)',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (values.startDate && !values.endDate)
                                        return 'Please select both date for range!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'paymentStatus',
                                placeholder: 'Select payment status!',
                                title: 'Payment Status',
                                initialValue: null,
                                options: getPaymentStatusOptions(),
                            },
                            {
                                type: 'select-sync',
                                name: 'bookingStatus',
                                placeholder: 'Select booking status!',
                                title: 'Booking Status',
                                initialValue: null,
                                options: getBookingStatusOptions(),
                            },
                        ]}
                        router={router}
                        pathParams={{ tripId: router.query.tripId }}
                    />
                }
                pagination={<PaginatorComponent router={router} pathParams={{ tripId: router.query.tripId }} />}
            />
        </WrapperComponent>
    );
};

export default Page;

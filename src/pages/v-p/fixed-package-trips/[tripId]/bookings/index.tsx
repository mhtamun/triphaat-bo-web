import React from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Badge } from 'primereact/badge';
import { PrimeIcons } from 'primereact/api';
import { faFileAlt, faFile, faFileArchive, faChair } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../libs/auth';
import GenericViewGenerator from '../../../../../components/global/GenericViewGenerator';
import { getTripBookingFacts, getTripForVendor } from '../../../../../apis';
import WrapperComponent from '../../../../../components/trips/WrapperComponent';
import { generateQueryPath, getBookingStatusOptions, getPaymentStatusOptions, getSeverity } from '../../../../../utils';
import FilterComponent from '../../../../../components/global/Filter';
import PaginatorComponent from '../../../../../components/global/Paginator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Bookings | Trip Management', async cookies => {
        const tripId = context.query.tripId as string;

        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);
        const responseGetTripBookingFacts = await getTripBookingFacts(
            tripId,
            `${cookies.accessType} ${cookies.accessToken}`
        );

        if (
            !responseGetTrip ||
            responseGetTrip.statusCode !== 200 ||
            !responseGetTripBookingFacts ||
            responseGetTripBookingFacts.statusCode !== 200
        ) {
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
            facts: responseGetTripBookingFacts.data,
        };
    });

const Page = ({
    tripId,
    trip,
    facts,
}: {
    tripId: string;
    trip: any;
    facts: {
        seatsLeft: number;
        totalSeats: number;
        pendingBookings: number;
        confirmedBookings: number;
        canceledBookings: number;
    };
}) => {
    const router = useRouter();
    console.debug({ router });

    return (
        <WrapperComponent tripId={tripId} title={`Trip: ${trip?.name}, Bookings`} router={router}>
            <div className="grid mb-3">
                <div className="col-12 lg:col-6 xl:col-3 ">
                    <div className="card mb-0 bg-gray-100">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Seats left</span>
                                <div className="text-900 font-medium text-xl">{facts.seatsLeft}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-gray-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <FontAwesomeIcon icon={faChair} className="text-black-500 text-xl" />
                            </div>
                        </div>

                        <span className="text-500">out of total</span>
                        <span className="text-green-500 font-medium"> {facts.totalSeats} seats</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 bg-yellow-100">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Booking</span>
                                <div className="text-900 font-medium text-xl">{facts.pendingBookings}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-yellow-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <FontAwesomeIcon icon={faFileAlt} className="text-yellow-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Pending, locked or reserved</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 bg-green-100 ">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Booking</span>
                                <div className="text-900 font-medium text-xl">{facts.confirmedBookings}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-green-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <FontAwesomeIcon icon={faFile} className="text-green-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Confirmed</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 bg-red-100">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Booking</span>
                                <div className="text-900 font-medium text-xl">{facts.canceledBookings}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-red-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <FontAwesomeIcon icon={faFileArchive} className="text-red-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Canceled or expired</span>
                    </div>
                </div>
            </div>
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

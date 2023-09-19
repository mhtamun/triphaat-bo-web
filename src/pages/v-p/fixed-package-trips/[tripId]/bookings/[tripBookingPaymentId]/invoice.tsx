import React, { useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { PDFViewer } from '@react-pdf/renderer';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import { getTripForVendor } from '../../../../../../apis';
import WrapperComponent from '../../../../../../components/trips/WrapperComponent';
import Invoice from '../../../../../../components/reports/invoice';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Invoice | Bookings | Trip Management', async cookies => {
        const tripId = context.query.tripId;
        const tripBookingPaymentId = context.query.tripBookingPaymentId;

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

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <WrapperComponent tripId={tripId} title={'Bookings: ' + trip?.name} router={router}>
            {!isClient ? null : (
                <PDFViewer style={{ width: '100%', minHeight: '1280px' }}>
                    <Invoice
                        data={{
                            from: {
                                name: 'TripHaat As Vendor',
                                address: 'Dhaka',
                                phone: '+8801828048282',
                                email: 'vendor@triphaat.com',
                            },
                            to: {
                                name: 'TripHaat As Customer',
                                address: 'Dhaka',
                                phone: '+8801828048282',
                                email: 'customer@triphaat.com',
                            },
                            report: {
                                number: '01',
                                date: '2023-09-19',
                                status: 'Pending',
                            },
                            items:
                                [
                                    {
                                        serial: '1',
                                        description: 'Test',
                                        amount: 123.12,
                                    },
                                ] ?? [],
                            // subtotal: _.reduce(items, (result, value, index) => result + value.amount, 0),
                            // discountAmount: invoice.discountAmount ?? 0,
                            // netTotalAmount:
                            //     _.reduce(items, (result, value, index) => result + value.amount, 0) -
                            //         invoice.discountAmount ?? 0,
                            // advanceAmount: invoice.advanceAmount ?? 0,
                            // dueAmount:
                            //     (_.reduce(items, (result, value, index) => result + value.amount, 0) -
                            //         invoice.discountAmount ?? 0) - invoice.advanceAmount ?? 0,
                        }}
                    />
                </PDFViewer>
            )}
        </WrapperComponent>
    );
};

export default Page;

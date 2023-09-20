import React, { useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PDFViewer } from '@react-pdf/renderer';
import { faEnvelope, faCommentSms, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import { getTripBookingPaymentForVendor } from '../../../../../../apis';
import Invoice from '../../../../../../components/reports/invoice';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Invoice | Bookings | Trip Management', async cookies => {
        const tripId = context.query.tripId as string;
        const tripBookingPaymentId = context.query.tripBookingPaymentId as string;

        const responseGetTripBookingPayment = await getTripBookingPaymentForVendor(
            tripId,
            tripBookingPaymentId,
            `${cookies.accessType} ${cookies.accessToken}`
        );

        if (!responseGetTripBookingPayment || responseGetTripBookingPayment.statusCode !== 200) {
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
            tripBookingPayment: responseGetTripBookingPayment.data,
        };
    });

const Page = ({ tripId, trip }: { tripId: string; trip: any; tripBookingPayment: any }) => {
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return !isClient ? null : (
        <div className="grid">
            <div className="xl:col-9 lg:col-8 md:col-8 sm:col-12">
                <Card>
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
                </Card>
            </div>
            <div className="xl:col-3 lg:col-4 md:col-4 sm:col-12">
                <Card
                    className="mb-3"
                    title="Manual Payment Received"
                    subTitle="If you receive payment from the customer manually, please confirm?"
                >
                    <Button
                        className="btn-block"
                        severity="success"
                        raised
                        onClick={e => {
                            e.preventDefault();
                        }}
                        style={{ width: '100%' }}
                    >
                        <FontAwesomeIcon icon={faCircleCheck} className="mr-3" />
                        Confirm
                    </Button>
                </Card>
                <Card
                    className="mb-3"
                    title="Send Invoice to Customer"
                    subTitle="If your customer wants to pay via payment gateway send invoice including a link of payment gateway via SMS or EMAIL."
                >
                    <p style={{ color: 'red' }}>
                        Disclaimer: For email send to customer is free but the will be a charge for every SMS you send.
                    </p>
                    <Button
                        className="btn-block"
                        severity="help"
                        raised
                        onClick={e => {
                            e.preventDefault();
                        }}
                        style={{ width: '100%' }}
                    >
                        <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                        Email
                    </Button>
                    <Button
                        className="btn-block mt-3"
                        severity="info"
                        raised
                        onClick={e => {
                            e.preventDefault();
                        }}
                        style={{ width: '100%' }}
                    >
                        <FontAwesomeIcon icon={faCommentSms} className="mr-3" />
                        SMS
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default Page;

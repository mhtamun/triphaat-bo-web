import React, { useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PDFViewer } from '@react-pdf/renderer';
import { faEnvelope, faCommentSms, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import {
    getTripBookingPaymentForVendor,
    postManualTripBookingConfirm,
    postManualTripBookingCancel,
    sendInvoiceViaEmail,
    reserveBooking,
} from '../../../../../../apis';
import WrapperComponent from '../../../../../../components/trips/WrapperComponent';
import Invoice from '../../../../../../components/reports/invoice';
import { DATE_FORMAT, getFormattedDatetime } from '../../../../../../utils/date';

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

const Page = ({ tripId, tripBookingPayment }: { tripId: string; tripBookingPayment: any }) => {
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // console.debug({ tripBookingPayment });

    return !isClient ? null : (
        <WrapperComponent
            title={'Trip: ' + tripBookingPayment?.tripBooking?.trip?.name}
            tripId={tripId}
            router={router}
        >
            {!tripBookingPayment || tripBookingPayment.status !== 'PENDING' ? null : (
                <div className="grid">
                    <div className="xl:col-6 lg:col-6 md:col-6 sm:col-12">
                        <Card
                            title="Manual Payment Received"
                            subTitle="If you receive payment from the customer manually, please confirm?"
                            footer={
                                <div className="flex flex-wrap justify-content-start gap-3">
                                    <Button
                                        className="w-auto"
                                        severity="success"
                                        raised
                                        onClick={e => {
                                            e.preventDefault();

                                            postManualTripBookingConfirm(tripId, tripBookingPayment.id).then(
                                                response => {
                                                    console.debug({ response });

                                                    if (!response) throw new Error('API call not resolved!');

                                                    if (response.statusCode === 200) router.reload();
                                                }
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCircleCheck} className="mr-3" />
                                        CONFIRM
                                    </Button>
                                    <Button
                                        className="w-auto"
                                        severity="danger"
                                        raised
                                        onClick={e => {
                                            e.preventDefault();

                                            postManualTripBookingCancel(tripId, tripBookingPayment.id).then(
                                                response => {
                                                    console.debug({ response });

                                                    if (!response) throw new Error('API call not resolved!');

                                                    if (response.statusCode === 200) router.reload();
                                                }
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCircleExclamation} className="mr-3" />
                                        REJECT
                                    </Button>
                                </div>
                            }
                        ></Card>
                    </div>
                    <div className="xl:col-6 lg:col-6 md:col-6 sm:col-12">
                        <Card
                            title="Send Invoice to Customer"
                            subTitle="If your customer wants to pay online, send invoice with link of online payment via SMS or EMAIL."
                            footer={
                                <div className="flex flex-wrap justify-content-start gap-3">
                                    <Button
                                        className="w-auto"
                                        severity="info"
                                        raised
                                        onClick={e => {
                                            e.preventDefault();

                                            sendInvoiceViaEmail(tripId, tripBookingPayment.id)
                                                .then(response => {
                                                    console.debug({ response });

                                                    if (!response) throw new Error('API call not resolved!');

                                                    if (response.statusCode === 200) {
                                                        return reserveBooking({ bookingId: response.data.bookingId });
                                                    }

                                                    return null;
                                                })
                                                .then(response => {
                                                    console.debug({ response });

                                                    if (!response) throw new Error('Previous API call not resolved!');

                                                    if (response.statusCode === 200) router.reload();
                                                })
                                                .catch(error => {
                                                    console.error(error);
                                                });
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                                        EMAIL
                                    </Button>
                                    <Button
                                        className="w-auto"
                                        severity="info"
                                        raised
                                        onClick={e => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCommentSms} className="mr-3" />
                                        SMS
                                    </Button>
                                </div>
                            }
                        ></Card>
                    </div>
                </div>
            )}
            <div className="grid">
                <div className="col-12">
                    <Card>
                        <PDFViewer style={{ width: '100%', minHeight: '1280px' }}>
                            <Invoice
                                data={{
                                    report: {
                                        invoiceNumber: tripBookingPayment.id,
                                        invoiceDate: getFormattedDatetime(
                                            tripBookingPayment.createdAt,
                                            DATE_FORMAT.DATE_REPORT
                                        ),
                                        bookingStatus: tripBookingPayment?.tripBooking?.booking?.status,
                                        bookingDate: getFormattedDatetime(
                                            tripBookingPayment?.tripBooking?.booking?.createdAt,
                                            DATE_FORMAT.DATE_REPORT
                                        ),
                                        paymentMethod:
                                            tripBookingPayment.method === 'OTHER'
                                                ? tripBookingPayment.otherMethod ?? 'OTHER'
                                                : tripBookingPayment.method === 'MFS'
                                                ? tripBookingPayment.mfsMethod ?? 'MFS'
                                                : tripBookingPayment.method,
                                        paymentStatus: tripBookingPayment.status,
                                        paymentDate: !tripBookingPayment.date
                                            ? ''
                                            : getFormattedDatetime(tripBookingPayment.date, DATE_FORMAT.DATE_REPORT),
                                    },
                                    from: {
                                        name: tripBookingPayment?.tripBooking?.vendor?.businessName,
                                        address: tripBookingPayment?.tripBooking?.vendor?.businessAddress,
                                        phone: tripBookingPayment?.tripBooking?.vendor?.phone,
                                        email: tripBookingPayment?.tripBooking?.vendor?.email,
                                    },
                                    to: {
                                        name:
                                            tripBookingPayment?.tripBooking?.customer?.firstName +
                                            ' ' +
                                            tripBookingPayment?.tripBooking?.customer?.lastName,
                                        address: tripBookingPayment?.tripBooking?.customer?.address,
                                        phone: tripBookingPayment?.tripBooking?.customer?.phone,
                                        email: tripBookingPayment?.tripBooking?.customer?.email,
                                    },
                                    items: [
                                        {
                                            description: {
                                                tripName: tripBookingPayment?.tripBooking?.trip?.name,
                                                tripLocation: tripBookingPayment?.tripBooking?.trip?.location?.name,
                                                tripDuration:
                                                    tripBookingPayment?.tripBooking?.trip?.durationInDays +
                                                    ' day(s)/' +
                                                    tripBookingPayment?.tripBooking?.trip?.durationInNights +
                                                    'night(s)',
                                            },
                                            numberOfTravelers: tripBookingPayment?.tripBooking?.numberOfTravelers,
                                            pricePerPerson: tripBookingPayment?.tripBooking?.pricePerPerson,
                                        },
                                    ],
                                    amount: tripBookingPayment?.amount,
                                }}
                            />
                        </PDFViewer>
                    </Card>
                </div>
            </div>
        </WrapperComponent>
    );
};

export default Page;

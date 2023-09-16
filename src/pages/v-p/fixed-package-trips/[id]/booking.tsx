import React, { useState, useRef, useCallback } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Messages } from 'primereact/messages';
import { Fieldset } from 'primereact/fieldset';
import { useTimer } from 'react-timer-hook';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericFormGenerator from '../../../../components/global/GenericFormGenerator';
import { getTripForVendor, getTripVariants, initBooking } from '../../../../apis';
import { FormikValues } from 'formik';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Booking | Fixed Package Trip', async cookies => {
        const tripId = context.query.id;
        // console.debug({
        //     tripId,
        // });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);
        const responseGetTripVariants = await getTripVariants(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            tripId,
            `${cookies.accessType} ${cookies.accessToken}`
        );

        if (
            !responseGetTrip ||
            responseGetTrip.statusCode !== 200 ||
            !responseGetTripVariants ||
            responseGetTripVariants.statusCode !== 200
        ) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        // console.debug({
        //     initBooking: responseInitBooking.data,
        // });

        return {
            isVendor: true,
            tripId,
            trip: responseGetTrip.data,
            variants: responseGetTripVariants.data,
        };
    });

const Page = ({ tripId, trip, variants }: { tripId: string; trip: any; variants: any[] }) => {
    // console.debug({ variants });

    const router = useRouter();

    const [isBookingInitiated, setBookingInitiated] = useState(false);
    const [numberOfTraveler, setNumberOfTraveler] = useState(0);
    console.debug({ numberOfTraveler });

    const bookingInitResponseMessage = useRef(null);

    const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
        onExpire: () => console.warn('onExpire called'),
        autoStart: false,
        expiryTimestamp: new Date(),
    });

    return (
        <>
            <div className="flex justify-content-between flex-wrap mb-3">
                <Button
                    className="btn-block"
                    icon="pi pi-angle-left"
                    label={'Cancel'}
                    severity={'danger'}
                    raised
                    onClick={e => {
                        e.preventDefault();

                        router.push('/v-p/fixed-package-trips/' + tripId);
                    }}
                />
                <div>
                    <Avatar label={minutes.toString()} className="mr-2" size="large" />
                    <Avatar label={'M'} className="mr-2" size="large" />
                    <h1 style={{ display: 'inline', padding: 0, marginRight: '5px' }}>:</h1>
                    <Avatar label={seconds.toString()} className="mr-2" size="large" />
                    <Avatar label={'S'} className="mr-2" size="large" />
                </div>
            </div>
            <Card title={trip?.name}>
                <GenericFormGenerator
                    fields={[
                        {
                            type: 'select-sync',
                            name: 'variantId',
                            placeholder: 'Select a price package!',
                            title: 'Please Select a Price Package Variant',
                            initialValue: null,
                            options: _.map(variants, variant => ({
                                value: variant.id,
                                label:
                                    (!variant.offerPricePerPerson
                                        ? variant.pricePerPerson
                                        : !parseFloat(variant.offerPricePerPerson)
                                        ? variant.pricePerPerson
                                        : variant.offerPricePerPerson) +
                                    ' - ' +
                                    _.join(variant.otherReasons, ', '),
                            })),
                            validate: (values: any) => {
                                if (!values.variantId) return 'Required!';

                                return null;
                            },
                            col: 2,
                        },
                        {
                            type: 'number',
                            name: 'numberOfTraveler',
                            placeholder: 'Enter number of traveler',
                            title: 'Number Of Traveler',
                            initialValue: null,
                            validate: (values: any) => {
                                if (!values.numberOfTraveler) return 'Required!';

                                return null;
                            },
                        },
                    ]}
                    submitButtonShow={!isBookingInitiated}
                    submitButtonText="Check if seat is available"
                    callback={(values: FormikValues) => {
                        // console.debug({ values });

                        initBooking({
                            tripId: parseInt(tripId),
                            variantId: values.variantId,
                            numberOfTraveler: values.numberOfTraveler,
                        })
                            .then(response => {
                                console.debug({ response });

                                if (response.statusCode !== 200) {
                                    bookingInitResponseMessage.current.show({
                                        sticky: false,
                                        severity: 'error',
                                        summary: response.error,
                                        detail: response.message,
                                        closable: false,
                                    });
                                } else {
                                    const time = new Date();
                                    time.setSeconds(time.getSeconds() + 1800);

                                    restart(time);

                                    setBookingInitiated(true);
                                    setNumberOfTraveler(values.numberOfTravel);
                                }
                            })
                            .catch(error => {
                                console.error(error);

                                bookingInitResponseMessage.current.show({
                                    sticky: true,
                                    severity: 'error',
                                    summary: '',
                                    detail: 'Something went wrong!',
                                    closable: false,
                                });
                            })
                            .finally();
                    }}
                    enableReinitialize={false}
                />
                <Messages ref={bookingInitResponseMessage} />
                <div className="grid">
                    {_.map(Array(5), (e, i) => (
                        <div className="col-6">
                            <Fieldset legend={'Traveler ' + (i + 1)}>
                                <GenericFormGenerator
                                    fields={[
                                        {
                                            type: 'text',
                                            name: 'firstName',
                                            placeholder: 'Enter first name this traveler!',
                                            title: 'First Name',
                                            initialValue: null,
                                            validate: (values: any) => {
                                                if (!values.firstName) return 'Required!';

                                                return null;
                                            },
                                        },
                                        {
                                            type: 'text',
                                            name: 'lastName',
                                            placeholder: 'Enter last name this traveler!',
                                            title: 'Last Name',
                                            initialValue: null,
                                            validate: (values: any) => {
                                                if (!values.lastName) return 'Required!';

                                                return null;
                                            },
                                        },
                                    ]}
                                    submitButtonShow={false}
                                    enableReinitialize={false}
                                />
                            </Fieldset>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    );
};

export default Page;

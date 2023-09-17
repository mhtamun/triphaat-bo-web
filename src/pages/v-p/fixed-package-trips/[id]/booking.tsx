import React, { useState, useRef, useCallback, useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Messages } from 'primereact/messages';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { useTimer } from 'react-timer-hook';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericFormGenerator from '../../../../components/global/GenericFormGenerator';
import {
    getTripForVendor,
    getTripVariants,
    initBooking,
    searchCustomersForVendor,
    submitBooking,
} from '../../../../apis';
import { FormikValues } from 'formik';
import { getSeverity } from '../../../../utils';

interface ICustomer {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    profileImageUrl: string;
    status: string;
}

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

    const [isBookingInitiated, setBookingInitiated] = useState<boolean>(false);
    const [jobId, setJobId] = useState<number>(0);
    const [bookingId, setBookingId] = useState<number>(0);
    const [searchCustomerInputValue, setSearchInputValue] = useState<string>('');
    const [customers, setCustomers] = useState<ICustomer[]>([]);

    const bookingInitResponseMessage = useRef(null);

    const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
        onExpire: () => console.warn('onExpire called'),
        autoStart: false,
        expiryTimestamp: new Date(),
    });

    const handleSearchCustomer = useCallback((key: string) => {
        searchCustomersForVendor(key)
            .then(response => {
                console.debug({ response });

                if (response.statusCode === 200) setCustomers(response.data);
            })
            .catch(error => {
                console.error({ error });

                setCustomers([]);
            })
            .finally();
    }, []);

    const submitHandler = useCallback(
        (payload: {
            jobId: number;
            bookingId: number;
            customerId?: number;
            phoneNumber?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
        }) => {
            submitBooking(payload)
                .then(response => {
                    // console.debug({ response });

                    if (response.statusCode !== 200) {
                    } else {
                    }
                })
                .catch(error => {
                    // console.error(error);
                })
                .finally();
        },
        []
    );

    const customerDataItemTemplate = (customer: ICustomer) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 card">
                    {!customer.profileImageUrl ? (
                        <i className="pi pi-user" style={{ fontSize: '2.5rem' }}></i>
                    ) : (
                        <img
                            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                            src={customer.profileImageUrl}
                            alt={customer.firstName}
                        />
                    )}
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{`${customer.firstName} ${customer.lastName}`}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <span className="font-semibold">{customer.email}</span>
                                </span>
                                <Tag value={customer.status} severity={getSeverity(customer.status)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">{customer.phoneNumber}</span>
                            <Button
                                disabled={customer.status !== 'ACTIVE'}
                                onClick={(e: React.MouseEvent) => {
                                    submitHandler({
                                        jobId,
                                        bookingId,
                                        customerId: customer.id,
                                    });
                                }}
                            >
                                Select
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return !variants || _.size(variants) === 0 ? (
        <div className="card">
            <h5>No Variants Found</h5>
            <p>
                Please add at least <strong>one</strong> trip variant
            </p>
            <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    router.push(`/v-p/fixed-package-trips/${tripId}/variants`);
                }}
            >
                Go
            </button>
        </div>
    ) : (
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
                <Fieldset legend={'Select package variant'}>
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
                                onChange: (name: string, value: any, setFieldValue) => {
                                    console.debug({ name, value });

                                    const variant = _.find(variants, variant => variant.id === value);

                                    setFieldValue(
                                        'pricePerPerson',
                                        !variant.offerPricePerPerson
                                            ? variant.pricePerPerson
                                            : !parseFloat(variant.offerPricePerPerson)
                                            ? variant.pricePerPerson
                                            : variant.offerPricePerPerson
                                    );
                                },
                                validate: (values: any) => {
                                    if (!values.variantId) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'pricePerPerson',
                                placeholder: 'Enter price per person',
                                title: 'Price Per Person',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.pricePerPerson) return 'Required!';

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
                                pricePerPerson: parseFloat(values.pricePerPerson),
                                numberOfTraveler: parseInt(values.numberOfTraveler),
                            })
                                .then(response => {
                                    // console.debug({ response });

                                    if (response.statusCode !== 200) {
                                        bookingInitResponseMessage.current.show({
                                            sticky: false,
                                            severity: 'error',
                                            summary: response.error,
                                            detail: response.message,
                                            closable: false,
                                        });
                                    } else {
                                        bookingInitResponseMessage.current.show({
                                            sticky: false,
                                            severity: 'success',
                                            summary: '',
                                            detail: response.message,
                                            closable: false,
                                        });

                                        const time = new Date();
                                        time.setSeconds(time.getSeconds() + 1800);

                                        restart(time);

                                        setBookingInitiated(true);
                                        setJobId(parseInt(response.data.job.id));
                                        setBookingId(response.data.booking.id);
                                    }
                                })
                                .catch(error => {
                                    // console.error(error);

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
                </Fieldset>
                <Messages ref={bookingInitResponseMessage} />
                {useMemo(
                    () =>
                        !isBookingInitiated ? null : (
                            <Fieldset className="mt-3" legend={'Search customer'}>
                                <div className="p-inputgroup flex-1">
                                    <InputText
                                        placeholder="Search customer by name or phone or email"
                                        value={searchCustomerInputValue}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            e.preventDefault();

                                            setSearchInputValue(e.target.value);
                                        }}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            // console.debug({ e });

                                            if (e.key === 'Enter' && e.code === 'Enter') {
                                                e.preventDefault();

                                                handleSearchCustomer(searchCustomerInputValue);
                                            }
                                        }}
                                    />
                                    <Button
                                        icon="pi pi-search"
                                        className="p-button-warning"
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            e.preventDefault();

                                            handleSearchCustomer(searchCustomerInputValue);
                                        }}
                                    />
                                </div>
                                {!customers ? null : (
                                    <DataView
                                        className="mt-3"
                                        value={customers}
                                        itemTemplate={customerDataItemTemplate}
                                        emptyMessage="No customer found, please insert customer information..."
                                        style={{ color: 'red' }}
                                    />
                                )}
                                {!customers ? null : _.size(customers) > 0 ? null : (
                                    <div className="mt-3">
                                        <GenericFormGenerator
                                            fields={[
                                                {
                                                    type: 'text',
                                                    name: 'firstName',
                                                    placeholder: 'Enter first name!',
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
                                                    placeholder: 'Enter last name!',
                                                    title: 'Last Name',
                                                    initialValue: null,
                                                    validate: (values: any) => {
                                                        if (!values.lastName) return 'Required!';

                                                        return null;
                                                    },
                                                },
                                                {
                                                    type: 'text',
                                                    name: 'phoneNumber',
                                                    placeholder: 'Enter phone number!',
                                                    title: 'Phone Number',
                                                    initialValue: null,
                                                    validate: (values: any) => {
                                                        if (!values.phoneNumber) return 'Required!';

                                                        return null;
                                                    },
                                                },
                                                {
                                                    type: 'text',
                                                    name: 'email',
                                                    placeholder: 'Enter email address!',
                                                    title: 'Email Address',
                                                    initialValue: null,
                                                },
                                            ]}
                                            submitButtonShow={true}
                                            submitButtonText="Submit"
                                            callback={values => {
                                                console.debug({ values });

                                                submitHandler({
                                                    jobId,
                                                    bookingId,
                                                    phoneNumber: values.phoneNumber,
                                                    firstName: values.firstName,
                                                    lastName: values.lastName,
                                                    email: values.email,
                                                });
                                            }}
                                            enableReinitialize={false}
                                        />
                                    </div>
                                )}
                            </Fieldset>
                        ),
                    [isBookingInitiated, searchCustomerInputValue, customers]
                )}
            </Card>
        </>
    );
};

export default Page;

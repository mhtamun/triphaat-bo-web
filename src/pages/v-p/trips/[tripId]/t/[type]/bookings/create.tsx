import React, { useState, useRef, useCallback, useMemo, FormEvent, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
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
import { getAuthorized } from '../../../../../../../libs/auth';
import GenericFormGenerator from '../../../../../../../components/global/GenericFormGenerator';
import {
    getTripForVendor,
    getTripVariants,
    initBooking,
    searchCustomersForVendor,
    lockBooking,
    getServiceDates,
    getRooms,
} from '../../../../../../../apis';
import { getSeverity } from '../../../../../../../utils';
import WrapperComponent from '../../../../../../../components/trips/WrapperComponent';
import { ICustomer } from '../../../../../../../types';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Create | Booking | Fixed Package Trip', async cookies => {
        const tripId = context.query.tripId;
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

    const [serviceDates, setServiceDates] = useState<any[] | null>(null);
    const [rooms, setRooms] = useState<any[] | null>(null);
    // console.debug({ rooms });
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
            phone?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
        }) => {
            lockBooking(payload)
                .then(response => {
                    // console.debug({ response });

                    if (response.statusCode === 200) {
                        router.push('/v-p/trips/' + tripId + '/t/' + router.query.type + '/bookings');
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
                            alt={customer.name}
                        />
                    )}
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{customer.name}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <span className="font-semibold">{customer.email}</span>
                                </span>
                                <Tag value={customer.status} severity={getSeverity(customer.status)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            {!customer.countryCode || !customer.phoneNumber ? null : (
                                <span className="text-2xl font-semibold">
                                    {`${customer.countryCode}${customer.phoneNumber}`}
                                </span>
                            )}
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
                                Reserve Trip
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (router.query.type === '1100') {
            getServiceDates(tripId)
                .then(response => {
                    // console.debug({ response });

                    if (!response) throw new Error('Something went wrong!');

                    if (response.statusCode !== 200) throw new Error(response.message);

                    setServiceDates(response.data);
                })
                .catch(error => {
                    console.error(error);
                });

            getRooms(tripId)
                .then(response => {
                    // console.debug({ response });

                    if (!response) throw new Error('Something went wrong!');

                    if (response.statusCode !== 200) throw new Error(response.message);

                    setRooms(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [router.query.type]);

    const formattedRooms = [];

    if (rooms && rooms.length > 0)
        for (const room of rooms) {
            const items = [];

            for (const seat of room.seats) {
                items.push({
                    value: `${seat.id}-${room.id}`,
                    label: `Seat: ${seat.identifier}`,
                });
            }

            formattedRooms.push({
                value: room.id,
                label: `Room: ${room.identifier}`,
                items,
            });
        }

    return !variants || _.size(variants) === 0 ? (
        <div className="card">
            {/* <h5>No Variants Found</h5> */}
            <h4 style={{ color: 'red' }}>
                You did not set <strong>price</strong> for this trip
            </h4>
            <p>
                Please add at least <strong style={{ color: 'orangered' }}>one</strong> trip variant
            </p>
            <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    router.push(`/v-p/trips/${tripId}/t/${router.query.type}/variants`);
                }}
            >
                Add Variants
            </button>
        </div>
    ) : (
        <WrapperComponent tripId={tripId} title={`Trip: ${trip?.name}, Create Booking`}>
            <div className="flex justify-content-between flex-wrap mb-3">
                <Button
                    className="btn-block"
                    icon="pi pi-angle-left"
                    label={'Cancel'}
                    severity={'danger'}
                    raised
                    onClick={e => {
                        e.preventDefault();

                        router.back();
                    }}
                />
                <div>
                    <Avatar label={minutes.toString()} className="mr-2" size="xlarge" />
                    <Avatar label={'M'} className="mr-2" size="xlarge" />
                    <h1 style={{ display: 'inline', padding: 0, marginRight: '5px' }}>:</h1>
                    <Avatar label={seconds.toString()} className="mr-2" size="xlarge" />
                    <Avatar label={'S'} className="mr-2" size="xlarge" />
                </div>
            </div>
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
                                    _.join(variant.reasons, ', ') +
                                    '. ' +
                                    variant.otherReasons,
                            })),
                            onChange: (name: string, value: any, setFieldValue: any) => {
                                // console.debug({ name, value });

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
                            name: 'numberOfTravelers',
                            placeholder: 'Enter number of traveler',
                            title: 'Number Of Traveler (Pax count)',
                            initialValue: null,
                            validate: (values: any) => {
                                if (!values.numberOfTravelers) return 'Required!';

                                return null;
                            },
                        },
                        {
                            type: 'date',
                            name: 'date',
                            placeholder: 'Select trip date',
                            title: 'Trip Date',
                            initialValue: null,
                            minDate: new Date(),
                            enabledDates: _.map(serviceDates, (serviceDate: any) => new Date(serviceDate.date)) ?? [],
                            notEnabledDateSelectionErrorMessage:
                                'This date is not available for selection or is not within the service dates.',
                            validate: (values: any) => {
                                if (!values.date) return 'Required';

                                return null;
                            },
                            col: 2,
                        },
                        {
                            type: 'multi-select-sync',
                            name: 'seats',
                            placeholder: 'Select seats...',
                            title: 'Trip Seats',
                            initialValue: null,
                            options: formattedRooms ?? [],
                            isGroupOptions: true,
                            validate: (values: any) => {
                                if (!values.seats) return 'Required';

                                return null;
                            },
                        },
                    ].filter(field => {
                        if (router.query.type === '0000' && field.name === 'date') return false;
                        if (router.query.type === '0000' && field.name === 'seats') return false;

                        return true;
                    })}
                    submitButtonShow={!isBookingInitiated}
                    submitButtonText="Check if seat is available"
                    callback={(values: FormikValues) => {
                        // console.debug({ values });

                        const serviceDateId =
                            !serviceDates || serviceDates.length === 0
                                ? null
                                : _.find(serviceDates, serviceDate => serviceDate.date === values.date).id;
                        // console.debug({ serviceDateId });

                        const roomSeats = _.map(values.seats, (seat: string) => ({
                            roomId: parseInt(_.split(seat, '-')[1]),
                            seatId: parseInt(_.split(seat, '-')[0]),
                        }));
                        // console.debug({ roomSeats });

                        initBooking({
                            tripId: parseInt(tripId),
                            variantId: values.variantId,
                            pricePerPerson: parseFloat(values.pricePerPerson),
                            numberOfTravelers: parseInt(values.numberOfTravelers),
                            serviceDateId,
                            roomSeats,
                        })
                            .then(response => {
                                // console.debug({ response });

                                if (response.statusCode !== 200) {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    bookingInitResponseMessage.current.show({
                                        sticky: false,
                                        severity: 'error',
                                        summary: response.error,
                                        detail: response.message,
                                        closable: false,
                                    });
                                } else {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
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
                                console.error(error);

                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
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
            {!isBookingInitiated ? null : (
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
                                        name: 'name',
                                        placeholder: 'Enter name!',
                                        title: 'Name',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.name) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'phone',
                                        placeholder: 'Enter a phone number!',
                                        title: 'Phone',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.phone) return 'Required!';

                                            if (values.phone && !values.phone.matches(/^01\d{9}$/))
                                                return 'Please enter a valid bangladeshi phone number!';

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
                                submitButtonText="Reserve Trip"
                                callback={values => {
                                    // console.debug({ values });

                                    submitHandler({
                                        jobId,
                                        bookingId,
                                        phone: values.phone,
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
            )}
        </WrapperComponent>
    );
};

export default Page;

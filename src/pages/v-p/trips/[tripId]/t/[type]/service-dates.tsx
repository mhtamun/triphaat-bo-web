import React, { useCallback, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import { Fieldset } from 'primereact/fieldset';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import { WrapperComponent, GenericFormGenerator, ModalConfirmation } from '../../../../../../components';
import { deleteServiceDate, getServiceDates, getTripForVendor, postServiceDates } from '../../../../../../apis';

const localizer = momentLocalizer(moment);

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Service Dates | Trip Management', async cookies => {
        const tripId = context.query.tripId as string;

        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);
        const responseGetServiceDates = await getServiceDates(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (
            !responseGetTrip ||
            responseGetTrip.statusCode !== 200 ||
            !responseGetServiceDates ||
            responseGetServiceDates.statusCode !== 200
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
            serviceDates: responseGetServiceDates.data,
        };
    });

const Page = ({ tripId, trip, serviceDates }: { tripId: string; trip: any; serviceDates: any[] }) => {
    const router = useRouter();

    // console.debug({ serviceDates });

    const [serviceDateId, setServiceDateId] = useState<string | null>(null);
    const [isDeleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState<boolean>(false);

    const handleSelectEvent = useCallback((event: any) => {
        // console.debug({ event });

        setServiceDateId(event.resource);
        setDeleteConfirmationModalOpen(!isDeleteConfirmationModalOpen);
    }, []);

    return (
        <WrapperComponent tripId={tripId} title={trip?.name} router={router}>
            <Fieldset legend="Add service dates">
                <GenericFormGenerator
                    fields={[
                        {
                            type: 'hidden',
                            name: 'tripId',
                            placeholder: '',
                            title: '',
                            initialValue: parseInt(tripId),
                            validate: (values: any) => {
                                if (!values.tripId) return 'Required!';

                                return null;
                            },
                        },
                        {
                            type: 'date-multiple',
                            name: 'dates',
                            placeholder: '',
                            title: 'Select Operating Dates',
                            initialValue: null,
                            minDate: new Date(),
                            validate: (values: any) => {
                                if (!values.dates) return 'Required';

                                return null;
                            },
                        },
                    ]}
                    submitButtonShow={true}
                    submitButtonText="Save Dates"
                    callback={(values: FormikValues, resetForm) => {
                        // console.debug({ values });

                        postServiceDates({ dates: values.dates, tripId: values.tripId })
                            .then(response => {
                                // console.debug({ response });

                                if (!response) throw new Error('Something went wrong!');

                                if (response.statusCode !== 200) throw new Error(response.message);

                                if (resetForm) resetForm();

                                router.reload();
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }}
                    enableReinitialize={false}
                />
            </Fieldset>
            <Fieldset legend="Calender" className="mt-3">
                <Calendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={serviceDates.map(serviceDate => ({
                        title: new Date(serviceDate.date).toUTCString(),
                        start: new Date(serviceDate.date),
                        end: new Date(serviceDate.date),
                        allDay: true,
                        resource: serviceDate.id,
                    }))}
                    style={{ height: '100vh' }}
                    views={['month']}
                    onSelectEvent={handleSelectEvent}
                />
            </Fieldset>

            <ModalConfirmation
                isOpen={isDeleteConfirmationModalOpen}
                onCancel={() => {
                    setDeleteConfirmationModalOpen(!isDeleteConfirmationModalOpen);
                }}
                title="Are you sure you want to delete this date?"
                subtitle="You cannot undo this operation."
                cancelCallback={() => {
                    setDeleteConfirmationModalOpen(!isDeleteConfirmationModalOpen);
                }}
                confirmCallback={() => {
                    setDeleteConfirmationModalOpen(!isDeleteConfirmationModalOpen);

                    if (serviceDateId)
                        deleteServiceDate(serviceDateId)
                            .then(response => {
                                // console.debug({ response });

                                if (!response) throw new Error('Something went wrong!');

                                if (response.statusCode !== 200) throw new Error(response.message);

                                router.reload();
                            })
                            .catch(error => {
                                console.error(error);
                            });
                }}
            />
        </WrapperComponent>
    );
};

export default Page;

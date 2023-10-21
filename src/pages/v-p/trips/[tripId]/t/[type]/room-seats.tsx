import React, { useCallback, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import { Fieldset } from 'primereact/fieldset';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import { WrapperComponent, GenericFormGenerator } from '../../../../../../components';
import { getTripForVendor, addRoom } from '../../../../../../apis';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Service Dates | Trip Management', async cookies => {
        const tripId = context.query.tripId as string;

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
        <WrapperComponent tripId={tripId} title={trip?.name} router={router}>
            <Fieldset legend="Add room seats">
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
                            type: 'text',
                            name: 'identifier',
                            placeholder: 'Enter a room name or title',
                            title: 'Room Title',
                            initialValue: null,
                            validate: (values: any) => {
                                if (!values.identifier) return 'Required!';

                                return null;
                            },
                            col: 2,
                        },
                        {
                            type: 'text',
                            name: 'type',
                            placeholder: 'Enter a type of the room',
                            title: 'Room Type',
                            initialValue: null,
                            validate: (values: any) => {
                                return null;
                            },
                        },
                        {
                            type: 'textarea',
                            name: 'description',
                            placeholder: 'Enter a description of the room',
                            title: 'Room Description',
                            initialValue: null,
                        },
                        {
                            type: 'number',
                            name: 'maxOccupancy',
                            placeholder: 'Maximum number of occupant (if applicable)',
                            title: 'Room Maximum Occupancy',
                            initialValue: null,
                            validate: (values: any) => {
                                return null;
                            },
                            col: 2,
                        },
                        {
                            type: 'number',
                            name: 'numberOfSeats',
                            placeholder: 'Number of seats inside the room',
                            title: 'Room Seats',
                            initialValue: null,
                            validate: (values: any) => {
                                if (router.query.type === '1100' && !values.numberOfSeats) return 'Required!';

                                return null;
                            },
                        },
                    ]}
                    submitButtonShow={true}
                    submitButtonText="Add Room"
                    callback={(values: FormikValues, resetForm) => {
                        // console.debug({ values });

                        addRoom({
                            tripId: values.tripId,
                            identifier: values.identifier,
                            type: values.type,
                            description: values.description,
                            maxOccupancy: values.maxOccupancy,
                            numberOfSeats: values.numberOfSeats,
                        })
                            .then(response => {
                                // console.debug({ response });

                                if (!response) throw new Error('API call not resolved!');

                                if (response.statusCode !== 200) throw new Error(response.message);

                                if (resetForm) resetForm();
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }}
                    enableReinitialize={false}
                />
            </Fieldset>
            <Fieldset legend="Room seat distribution view" className="mt-3"></Fieldset>
        </WrapperComponent>
    );
};

export default Page;

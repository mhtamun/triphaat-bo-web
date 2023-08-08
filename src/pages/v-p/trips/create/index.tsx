import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericFormGenerator from '../../../../components/global/GenericFormGenerator';
import { getLocationsForVendor } from '../../../../apis';
import { getGeneralStatusOptions } from '../../../../utils';
import { callPostApi } from '../../../../libs/api';
import { ILocation } from '../../../trips/create';

export const getTripFields = (locations: ILocation[]) => [
    {
        type: 'hidden',
        name: 'type',
        placeholder: '',
        title: '',
        initialValue: 'PRE_ARRANGED',
        validate: (values: any) => {
            if (!values.type) return 'Required!';

            return null;
        },
    },
    {
        type: 'text',
        name: 'name',
        placeholder: 'Enter trip name!',
        title: 'Name',
        initialValue: null,
        validate: (values: any) => {
            if (!values.name) return 'Required!';

            return null;
        },
    },
    {
        type: 'select-sync',
        name: 'locationName',
        placeholder: 'Select a location for trip!',
        title: 'Location Name',
        initialValue: null,
        options: _.map(locations, (location: ILocation) => ({
            value: location.name,
            label: `${location.name}, ${!location.city ? '' : ','} ${!location.state ? '' : ','} ${location.country}`,
        })),
        validate: (values: any) => {
            if (!values.locationName) return 'Required!';

            return null;
        },
    },
    {
        type: 'textarea',
        name: 'smallDescription',
        placeholder: 'Enter small description for this trip!',
        title: 'Small Description',
        initialValue: null,
        validate: (values: any) => {
            if (!values.smallDescription) return 'Required!';

            return null;
        },
    },
    {
        type: 'richtext',
        name: 'bigDescription',
        placeholder: 'Enter big description for this trip!',
        title: 'Big Description',
        initialValue: null,
        validate: (values: any) => {
            if (!values.bigDescription) return 'Required!';

            return null;
        },
    },
    {
        type: 'number',
        name: 'durationInDays',
        placeholder: 'Enter duration in days this trip!',
        title: 'Duration In Days',
        initialValue: null,
        validate: (values: any) => {
            if (!values.durationInDays) return 'Required!';

            return null;
        },
    },
    {
        type: 'number',
        name: 'durationInNights',
        placeholder: 'Enter duration in nights for this trip!',
        title: 'Duration In Nights',
        initialValue: null,
        validate: (values: any) => {
            if (!values.durationInNights) return 'Required!';

            return null;
        },
    },
    {
        type: 'date',
        name: 'startDate',
        placeholder: 'Enter start date for this trip!',
        title: 'Start Date',
        initialValue: null,
        validate: (values: any) => {
            if (!values.startDate) return 'Required!';

            return null;
        },
    },
    {
        type: 'date',
        name: 'endDate',
        placeholder: 'Enter end date for this trip!',
        title: 'End Date',
        initialValue: null,
        validate: (values: any) => {
            if (!values.endDate) return 'Required!';

            return null;
        },
    },
    {
        type: 'number',
        name: 'numberOfSeats',
        placeholder: 'Enter number of seats for this trip!',
        title: 'Number of Seats (Maximum)',
        initialValue: null,
        validate: (values: any) => {
            if (!values.numberOfSeats) return 'Required!';

            return null;
        },
    },
    {
        type: 'select-sync',
        name: 'isVisaRequired',
        placeholder: 'Select VISA requirements!',
        title: 'Visa Requirements',
        initialValue: false,
        options: [
            {
                value: true,
                label: 'Visa Required',
            },
            {
                value: false,
                label: 'Visa Not Required',
            },
        ],
        validate: (values: any) => {
            if (!values.status) return 'Required!';

            return null;
        },
    },
    {
        type: 'select-sync',
        name: 'status',
        placeholder: 'Select status!',
        title: 'Status',
        initialValue: 'ACTIVE',
        options: getGeneralStatusOptions(),
        validate: (values: any) => {
            if (!values.status) return 'Required!';

            return null;
        },
    },
];

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Create A Trip | Trip Management', async cookies => {
        const responseGetLocations = await getLocationsForVendor();

        if (!responseGetLocations || responseGetLocations.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/errors/500',
                    permanent: false,
                },
            };
        }

        // console.debug(responseGetLocations.data);

        return {
            isVendor: true,
            locations: responseGetLocations.data,
        };
    });

const Page = ({ locations }: { locations: ILocation[] }) => {
    const router = useRouter();

    return (
        <>
            <Card title="Create A Trip">
                {useMemo(
                    () =>
                        !locations || _.size(locations) === 0 ? null : (
                            <GenericFormGenerator
                                fields={getTripFields(locations)}
                                callback={(data, resetForm) => {
                                    // console.debug({ data });

                                    callPostApi('/vendor/api/v1/trips', data, null, null, true)
                                        .then(response => {
                                            if (!response) {
                                                // showToast('error', 'Unsuccessful!', 'Server not working!');
                                            } else if (response.statusCode !== 200) {
                                                // showToast('error', 'Unsuccessful!', response.message);
                                            } else {
                                                resetForm();

                                                // showToast('success', 'Success!', response.message);

                                                router.push(`/v-p/trips/${response.data.id}`);
                                            }
                                        })
                                        .catch(error => {
                                            console.error('error', error);

                                            // showToast('error', 'Unsuccessful!', 'Something went wrong!');
                                        })
                                        .finally(() => {});
                                }}
                                submitButtonText="Save"
                            />
                        ),
                    [locations]
                )}
            </Card>
        </>
    );
};

export default Page;

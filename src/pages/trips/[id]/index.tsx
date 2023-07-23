import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericFormGenerator from '../../../components/global/GenericFormGenerator';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';
import { getLocations, getTrip, getVendors } from '../../../apis';
import { getGeneralStatusOptions } from '../../../utils';
import { callPostApi } from '../../../libs/api';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Trip Management', () => {
        const tripId = context.query.id;

        // console.debug({ roleId });

        return {
            tripId,
        };
    });

const Page = ({ tripId }: { tripId: string }) => {
    const [vendors, setVendors] = useState(null);
    const [locations, setLocations] = useState(null);
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        getVendors()
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                } else if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setVendors(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});

        getLocations()
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                } else if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setLocations(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});

        getTrip(tripId)
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                } else if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setTrip(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});
    }, []);

    return (
        <>
            <Card title={trip?.name} className="mb-3"></Card>
            <Card title="Trip Detail" className="mb-3">
                {useMemo(
                    () =>
                        !trip ? null : (
                            <GenericFormGenerator
                                datum={{
                                    ...trip,
                                    startDate: trip.startDate.split('T')[0],
                                    endDate: trip.endDate.split('T')[0],
                                }}
                                fields={[
                                    {
                                        type: 'select-sync',
                                        name: 'vendorId',
                                        placeholder: 'Select a vendor!',
                                        title: 'Vendor',
                                        initialValue: null,
                                        options: _.map(
                                            vendors,
                                            (vendor: {
                                                id: number;
                                                businessName: string;
                                                phone: string;
                                                email: string;
                                            }) => ({
                                                value: vendor.id,
                                                label: vendor.businessName + ' ' + vendor.phone + ' ' + vendor.email,
                                            })
                                        ),
                                        validate: (values: any) => {
                                            if (!values.vendorId) return 'Required!';

                                            return null;
                                        },
                                    },
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
                                        options: _.map(
                                            locations,
                                            (location: {
                                                name: string;
                                                city: string;
                                                state: string;
                                                country: string;
                                            }) => ({
                                                value: location.name,
                                                label:
                                                    location.name +
                                                    ' ' +
                                                    location.city +
                                                    ' ' +
                                                    location.state +
                                                    ' ' +
                                                    location.country,
                                            })
                                        ),
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
                                ]}
                                callback={(data, callback) => {
                                    // console.debug({ data });

                                    callPostApi('/api/v1/trips', data)
                                        .then(response => {
                                            if (!response) {
                                                // showToast('error', 'Unsuccessful!', 'Server not working!');
                                            } else if (response.statusCode !== 200) {
                                                // showToast('error', 'Unsuccessful!', response.message);
                                            } else {
                                                callback();

                                                // showToast('success', 'Success!', response.message);
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
                    [trip]
                )}
            </Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Variant'}
                        title="Trip Variant"
                        subtitle="Manage trip variants here!"
                        viewAll={{
                            uri: `/api/v1/variants`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    trips: null,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/variants`,
                            buttonText: 'Add Variant',
                        }}
                        viewOne={{ uri: '/api/v1/variants/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/variants/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/variants/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
                            {
                                type: 'hidden',
                                name: 'tripId',
                                placeholder: '',
                                title: '',
                                initialValue: tripId,
                                validate: (values: any) => {
                                    if (!values.type) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'reasons',
                                placeholder: 'Enter reasons for this variant!',
                                title: 'Reasons',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.reasons) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'costPrice',
                                placeholder: 'Enter cost price!',
                                title: 'Cost Price',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.costPrice) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'price',
                                placeholder: 'Enter price!',
                                title: 'Price',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.price) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'offerPrice',
                                placeholder: 'Enter offer price!',
                                title: 'Offer Price',
                                initialValue: null,
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
                        ]}
                    />
                ),
                [trip]
            )}
            <div className="mb-3"></div>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Image'}
                        title="Trip Image"
                        subtitle="Manage trip images here!"
                        viewAll={{
                            uri: `/api/v1/images`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    trips: null,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/images`,
                            buttonText: 'Add Image',
                        }}
                        viewOne={{ uri: '/api/v1/images/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/images/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/images/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
                            {
                                type: 'hidden',
                                name: 'tripId',
                                placeholder: '',
                                title: '',
                                initialValue: tripId,
                                validate: (values: any) => {
                                    if (!values.type) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'url',
                                placeholder: 'Enter image URL for this trip!',
                                title: 'Reasons',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.url) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'title',
                                placeholder: 'Enter title for this image!',
                                title: 'Title',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'description',
                                placeholder: 'Enter description for this image!',
                                title: 'Description',
                                initialValue: null,
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
                        ]}
                    />
                ),
                [trip]
            )}
            <div className="mb-3"></div>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Video'}
                        title="Trip Video"
                        subtitle="Manage trip videos here!"
                        viewAll={{
                            uri: `/api/v1/videos`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    trips: null,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/videos`,
                            buttonText: 'Add Video',
                        }}
                        viewOne={{ uri: '/api/v1/videos/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/videos/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/videos/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
                            {
                                type: 'hidden',
                                name: 'tripId',
                                placeholder: '',
                                title: '',
                                initialValue: tripId,
                                validate: (values: any) => {
                                    if (!values.type) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'url',
                                placeholder: 'Enter image URL for this trip!',
                                title: 'Reasons',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.url) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'title',
                                placeholder: 'Enter title for this image!',
                                title: 'Title',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'description',
                                placeholder: 'Enter description for this image!',
                                title: 'Description',
                                initialValue: null,
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
                        ]}
                    />
                ),
                [trip]
            )}
            <div className="mb-3"></div>
        </>
    );
};

export default Page;

import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericFormGenerator from '../../../components/global/GenericFormGenerator';
import { getLocations, getVendors } from '../../../apis';
import { getGeneralStatusOptions } from '../../../utils';
import { callGetApi, callDeleteApi, callPutApi, callPostApi } from '../../../libs/api';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context);

const Page = () => {
    const [vendors, setVendors] = useState(null);
    const [locations, setLocations] = useState(null);

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
    }, []);

    return (
        <>
            <Card title="Create A Trip">
                <GenericFormGenerator
                    fields={[
                        {
                            type: 'select-sync',
                            name: 'vendorId',
                            placeholder: 'Select a vendor!',
                            title: 'Vendor',
                            initialValue: null,
                            options: _.map(
                                vendors,
                                (vendor: { id: number; businessName: string; phone: string; email: string }) => ({
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
                                (location: { name: string; city: string; state: string; country: string }) => ({
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
            </Card>
        </>
    );
};

export default Page;

import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../../utils';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context, 'Location Management');

const Page = () => {
    return (
        <>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Location'}
                        title="Locations"
                        subtitle="Manage locations here!"
                        viewAll={{
                            uri: `/api/v1/locations`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    trips: null,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/locations`,
                        }}
                        viewOne={{ uri: '/api/v1/locations/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/locations/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/locations/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
                            {
                                type: 'text',
                                name: 'name',
                                placeholder: 'Enter location name!',
                                title: 'Name',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.name) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'city',
                                placeholder: 'Enter location city!',
                                title: 'City',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'state',
                                placeholder: 'Enter location state!',
                                title: 'State',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'country',
                                placeholder: 'Enter location country!',
                                title: 'Country',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.country) return 'Required!';

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
                    />
                ),
                []
            )}
        </>
    );
};

export default Page;

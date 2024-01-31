import React, { useEffect, useMemo, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getLocations } from '../../apis';
import { ILocation } from '../../types';
import { ISelectOption } from '../../components/global/Dropdown';
import { getGeneralStatusOptions } from '../../utils';
import { UrlBasedColumnItem } from '../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured Location Management | Admin Panel | TripHaat', () => {
        return null;
    });

const Page = () => {
    const router = useRouter();

    const [locations, setLocations] = useState<ISelectOption[]>([]);

    useEffect(() => {
        getLocations()
            .then(response => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                setLocations(
                    _.map(response.data, (location: ILocation) => ({
                        value: location.id,
                        label: `${location.name}, ${location?.city?.name}`,
                    }))
                );
            })
            .catch(error => {
                console.error('error', error);
            });
    }, []);

    return (
        <Card title="" subTitle="">
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Featured Location'}
                        title={'Featured Locations'}
                        subtitle={'Manage featured-locations here!'}
                        viewAll={{
                            uri: `/api/v1/featured-locations`,
                            ignoredColumns: ['_id', '__v', 'locationId', 'createdAt', 'updatedAt'],
                            scopedColumns: {
                                imageUrl: (item: any) => <UrlBasedColumnItem url={item.imageUrl} />,
                            },
                            actionIdentifier: '_id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/featured-locations`,
                        }}
                        // viewOne={{ uri: '/api/v1/featured-locations/{id}', identifier: '{id}' }}
                        // editExisting={{ uri: '/api/v1/featured-locations/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/featured-locations/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[]}
                        fields={[
                            {
                                type: 'select-sync',
                                name: 'locationId',
                                placeholder: 'Select location',
                                title: 'Location',
                                initialValue: null,
                                options: locations,
                                isSearchable: true,
                                validate(values) {
                                    if (!values.locationId) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'imageUrl',
                                placeholder: 'Select image',
                                title: 'Image URL',
                                initialValue: null,
                                validate(values) {
                                    if (!values.imageUrl) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'serial',
                                placeholder: 'Enter a serial!',
                                title: 'Serial',
                                initialValue: 9999,
                                validate: (values: any) => {
                                    if (!values.serial) return 'Serial required!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'status',
                                placeholder: 'Select a status!',
                                title: 'Status',
                                initialValue: 'ACTIVE',
                                options: getGeneralStatusOptions(),
                                validate: (values: any) => {
                                    if (!values.status) return 'Status required!';

                                    return null;
                                },
                            },
                        ]}
                    />
                ),
                [locations, locations]
            )}
        </Card>
    );
};

export default Page;

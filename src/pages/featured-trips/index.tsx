import React, { useCallback, useEffect, useMemo, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { searchTripsForSelectByLocationId, getLocations } from '../../apis';
import { ILocation } from '../../types';
import { ISelectOption } from '../../components/global/Dropdown';
import { getGeneralStatusOptions } from '../../utils';
import { getFormattedDatetime, DATE_FORMAT } from '../../utils/date';
import { UrlBasedColumnItem } from '../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured Trip Management | Admin Panel | TripHaat', () => {
        return null;
    });

const Page = () => {
    const router = useRouter();

    const [locations, setLocations] = useState<ISelectOption[]>([]);
    // console.debug({ locations });
    const [locationId, setLocationId] = useState<number | null>(null);
    const [trips, setTrips] = useState<ISelectOption[]>([]);
    // console.debug({ trips });

    const getTrips = useCallback((locationId: number) => {
        searchTripsForSelectByLocationId(locationId, null)
            .then(response => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                setTrips(
                    _.map(response.data, (trip: any) => ({
                        value: trip.id,
                        label: trip.vendor.businessName + ' - ' + trip.name,
                    }))
                );
            })
            .catch(error => {
                console.error('error', error);
            });
    }, []);

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

    useEffect(() => {
        if (!_.isNull(locationId)) getTrips(locationId);
    }, [locationId]);

    return (
        <Card title="" subTitle="">
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Featured Trip'}
                        title={'Featured Trips'}
                        subtitle={'Manage featured-trips here!'}
                        viewAll={{
                            uri: `/api/v1/featured-trips`,
                            ignoredColumns: ['_id', '__v', 'createdAt', 'updatedAt'],
                            scopedColumns: {
                                imageUrl: (item: any) => <UrlBasedColumnItem url={item.imageUrl} type="image" />,
                            },
                            actionIdentifier: '_id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    startDate: !datum.startDate
                                        ? null
                                        : getFormattedDatetime(datum.startDate, DATE_FORMAT.DATE_REPORT),
                                    endDate: !datum.endDate
                                        ? null
                                        : getFormattedDatetime(datum.endDate, DATE_FORMAT.DATE_REPORT),
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/featured-trips`,
                        }}
                        // viewOne={{ uri: '/api/v1/featured-trips/{id}', identifier: '{id}' }}
                        // editExisting={{ uri: '/api/v1/featured-trips/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/featured-trips/{id}',
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
                                onChange(name, value, callback) {
                                    setLocationId(value);
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'tripId',
                                placeholder: 'Select trip',
                                title: 'Trip',
                                initialValue: null,
                                options: [...trips],
                                isSearchable: true,
                                validate(values) {
                                    if (!values.tripId) return 'Required!';

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
                [locations, trips]
            )}
        </Card>
    );
};

export default Page;

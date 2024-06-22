import React, { useCallback, useEffect, useMemo, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getCategories, searchTripsForSelectByCategoryId } from '../../apis';
import { ICategory, ILocation } from '../../types';
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

    const [categories, setCategories] = useState<ISelectOption[]>([]);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [trips, setTrips] = useState<ISelectOption[]>([]);

    const getTrips = useCallback((categoryId: number) => {
        searchTripsForSelectByCategoryId(categoryId, null)
            .then(response => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                setTrips(
                    _.map(response.data, (trip: any) => ({
                        value: trip.id,
                        label: trip.name,
                    }))
                );
            })
            .catch(error => {
                console.error('error', error);
            });
    }, []);

    useEffect(() => {
        if (!_.isNull(categoryId)) getTrips(categoryId);
    }, [categoryId]);

    useEffect(() => {
        getCategories()
            .then(response => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                setCategories(
                    _.map(response.data, (category: ICategory) => ({
                        value: category.id,
                        label: category.title,
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
                        name={'Featured Categorized Item'}
                        title={'Featured Categorized Items'}
                        subtitle={'Manage featured-categorized-items here!'}
                        viewAll={{
                            uri: `/api/v1/featured-trips`,
                            ignoredColumns: ['_id', '__v', 'createdAt', 'updatedAt'],
                            scopedColumns: {
                                imageUrl: (item: any) => <UrlBasedColumnItem url={item.imageUrl} />,
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
                                name: 'categoryId',
                                placeholder: 'Select category',
                                title: 'Category',
                                initialValue: null,
                                options: categories,
                                isSearchable: true,
                                validate(values) {
                                    if (!values.categoryId) return 'Required!';

                                    return null;
                                },
                                onChange(name, value, callback) {
                                    console.debug({ name, value, callback });

                                    setCategoryId(value);
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
                [categories, trips]
            )}
        </Card>
    );
};

export default Page;

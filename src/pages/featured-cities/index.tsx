import React, { useEffect, useMemo, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getCities } from '../../apis';
import { ICity } from '../../types';
import { ISelectOption } from '../../components/global/Dropdown';
import { getGeneralStatusOptions } from '../../utils';
import { UrlBasedColumnItem } from '../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured City Management | Admin Panel | TripHaat', () => {
        return null;
    });

const Page = () => {
    const router = useRouter();

    const [cities, setCities] = useState<ISelectOption[]>([]);

    useEffect(() => {
        getCities()
            .then(response => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                setCities(
                    _.map(response.data, (city: ICity) => ({
                        value: city.id,
                        label: city.name + ', ' + city.state?.name,
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
                        name={'Featured City'}
                        title={'Featured Cities'}
                        subtitle={'Manage featured-cities here!'}
                        viewAll={{
                            uri: `/api/v1/featured-cities`,
                            ignoredColumns: ['_id', '__v', 'createdAt', 'updatedAt'],
                            scopedColumns: {
                                imageUrl: (item: any) => <UrlBasedColumnItem url={item.imageUrl} type="image" />,
                            },
                            actionIdentifier: '_id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/featured-cities`,
                        }}
                        // viewOne={{ uri: '/api/v1/featured-cities/{id}', identifier: '{id}' }}
                        // editExisting={{ uri: '/api/v1/featured-cities/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/featured-cities/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[]}
                        fields={[
                            {
                                type: 'select-sync',
                                name: 'cityId',
                                placeholder: 'Select city',
                                title: 'City',
                                initialValue: null,
                                options: cities,
                                isSearchable: true,
                                validate(values) {
                                    if (!values.cityId) return 'Required!';

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
                [cities, cities]
            )}
        </Card>
    );
};

export default Page;

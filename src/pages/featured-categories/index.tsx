import React, { useEffect, useMemo, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getCategories } from '../../apis';
import { ICategory } from '../../types';
import { ISelectOption } from '../../components/global/Dropdown';
import { getGeneralStatusOptions } from '../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured Category Management | Admin Panel | TripHaat', () => {
        return null;
    });

const Page = () => {
    const router = useRouter();

    const [categories, setCategories] = useState<ISelectOption[]>([]);

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
                        name={'Featured Category'}
                        title={'Featured Categories'}
                        subtitle={'Manage featured-categories here!'}
                        viewAll={{
                            uri: `/api/v1/featured-categories`,
                            ignoredColumns: ['_id', '__v', 'categoryId', 'createdAt', 'updatedAt'],
                            scopedColumns: {},
                            actionIdentifier: '_id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/featured-categories`,
                        }}
                        // viewOne={{ uri: '/api/v1/featured-categories/{id}', identifier: '{id}' }}
                        // editExisting={{ uri: '/api/v1/featured-categories/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/featured-categories/{id}',
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
                [categories, categories]
            )}
        </Card>
    );
};

export default Page;

import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { PrimeIcons } from 'primereact/api';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../utils';
import { IField } from '../../components/global/GenericFormGenerator';
import { UrlBasedColumnItem } from '../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Category Management | Admin Panel | TripHaat');

const Page = () => {
    const router = useRouter();

    const fields: IField[] = [
        {
            type: 'text',
            name: 'title',
            placeholder: 'Enter title for this image!',
            title: 'Title',
            initialValue: null,
            validate: (values: any) => {
                if (!values.title) return 'Required!';

                return null;
            },
        },
        {
            type: 'text',
            name: 'description',
            placeholder: 'Enter description for this image!',
            title: 'Description',
            initialValue: null,
        },
        {
            type: 'file-select',
            name: 'bannerImageFile',
            placeholder: 'Select banner image file!',
            title: 'Banner Image File',
            initialValue: null,
            acceptType: 'image/*',
            maxFileSize: 2097152,
        },
        {
            type: 'number',
            name: 'serial',
            placeholder: 'Enter serial number for sorting!',
            title: 'Serial',
            initialValue: 9999,
            validate: (values: any) => {
                if (!values.serial) return 'Required!';

                return null;
            },
            col: 2,
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

    return (
        <Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Category'}
                        title="Categories"
                        subtitle="Manage categories here!"
                        viewAll={{
                            uri: `/api/v1/categories`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            scopedColumns: {
                                bannerImageUrl: (item: any) => <UrlBasedColumnItem url={item.bannerImageUrl} />,
                                status: (item: any) => (
                                    <>
                                        <Badge
                                            value={item.status}
                                            size="large"
                                            severity={item.status === 'INACTIVE' ? 'danger' : 'success'}
                                        ></Badge>
                                    </>
                                ),
                            },
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/categories`,
                            buttonText: 'Add Category',
                        }}
                        viewOne={{ uri: '/api/v1/categories/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/categories/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/categories/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[
                            {
                                color: 'success',
                                icon: PrimeIcons.LIST,
                                text: 'Item List',
                                callback: identifier => {
                                    router.push(`/categories/${identifier}/items`);
                                },
                            },
                            {
                                color: 'success',
                                icon: PrimeIcons.PLUS_CIRCLE,
                                text: 'Item Create',
                                callback: identifier => {
                                    router.push(`/categories/${identifier}/items/create`);
                                },
                            },
                        ]}
                        fields={fields}
                        editFields={[
                            {
                                type: 'textarea',
                                name: 'bannerImageUrl',
                                placeholder: 'Update new banner image URL',
                                title: 'Banner Image URL',
                                initialValue: null,
                            },
                            ..._.filter(fields, (field: IField) => field.name !== 'bannerImageFile'),
                        ]}
                    />
                ),
                []
            )}
        </Card>
    );
};

export default Page;

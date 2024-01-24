import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Badge } from 'primereact/badge';
import * as _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../utils';
import { IField } from '../../components/global/GenericFormGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Category Management | Admin Panel | TripHaat');

const Page = () => {
    const fields: IField[] = [
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
            type: 'file-select',
            name: 'bannerImageFile',
            placeholder: 'Select banner image file!',
            title: 'Banner Image File',
            initialValue: null,
            acceptType: 'image/*',
            maxFileSize: 1048576,
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

    return useMemo(
        () => (
            <GenericViewGenerator
                name={'Category'}
                title="Categories"
                subtitle="Manage categories here!"
                viewAll={{
                    uri: `/api/v1/categories`,
                    ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                    scopedColumns: {
                        bannerImageUrl: (item: any) => (
                            <>
                                <span className="p-column-title">{item.title}</span>
                                <img src={item.url} alt={item.bannerImageUrl} className="shadow-2" width="100" />
                            </>
                        ),
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
                    buttonText: 'Add Image',
                }}
                viewOne={{ uri: '/api/v1/categories/{id}', identifier: '{id}' }}
                editExisting={{ uri: '/api/v1/categories/{id}', identifier: '{id}' }}
                removeOne={{
                    uri: '/api/v1/categories/{id}',
                    identifier: '{id}',
                }}
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
    );
};

export default Page;

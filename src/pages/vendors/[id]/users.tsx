import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';
import { getVendorById } from '../../../apis';
import { IVendor } from '../../../types';
import { getUserManagementFields } from '../../users';
import { BreadCrumb } from '../../../components';
import { getSeverity } from '../../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'User Management | Vendor | Admin Panel | TripHaat', async cookies => {
        const vendorId = context.query.id as string;

        const responseGetVendor = await getVendorById(vendorId, `${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetVendor || responseGetVendor.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            vendor: responseGetVendor.data,
        };
    });

const Page = ({ vendor }: { vendor: IVendor }) => {
    const router = useRouter();

    const roles = [
        { id: 2, name: 'Super Admin' },
        { id: 3, name: 'Admin' },
        { id: 4, name: 'Trip Manager' },
    ];

    return (
        <>
            <BreadCrumb router={router} />
            <Card title={vendor.businessName} subTitle={vendor.businessAddress}>
                {useMemo(
                    () =>
                        !roles ? null : (
                            <GenericViewGenerator
                                name={'User'}
                                title="Users"
                                subtitle="Manage user here!"
                                viewAll={{
                                    uri: `api/v1/vendors/${vendor.id}/users`,
                                    ignoredColumns: [
                                        'id',
                                        'password',
                                        'otp',
                                        'otpAttemptCount',
                                        'roleId',
                                        'createdAt',
                                        'updatedAt',
                                    ],
                                    scopedColumns: {
                                        status: (item: any) => (
                                            <Badge
                                                value={item.status}
                                                size="normal"
                                                severity={getSeverity(item.status)}
                                            ></Badge>
                                        ),
                                    },
                                    actionIdentifier: 'id',
                                    onDataModify: data =>
                                        _.map(data, datum => ({
                                            ...datum,
                                            role: datum.role.name,
                                        })),
                                }}
                                addNew={{
                                    uri: `api/v1/vendors/${vendor.id}/users`,
                                }}
                                viewOne={{ uri: 'api/v1/users/{id}', identifier: '{id}' }}
                                editExisting={{ uri: `api/v1/vendors/${vendor.id}/users/{id}`, identifier: '{id}' }}
                                removeOne={{
                                    uri: `api/v1/vendors/${vendor.id}/users/{id}`,
                                    identifier: '{id}',
                                }}
                                fields={getUserManagementFields(roles).filter(field => field.name !== 'status')}
                                editFields={getUserManagementFields(roles)
                                    .filter(field => field.name !== 'password')
                                    .map(field =>
                                        field.name !== 'email' ? { ...field } : { ...field, isDisabled: true }
                                    )}
                            />
                        ),
                    [roles]
                )}
            </Card>
        </>
    );
};

export default Page;

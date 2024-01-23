import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';
import { getUserManagementFields } from '../../users';
import { getSeverity } from '../../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'User Management | Administration | Vendor Panel | TripHaat', () => {
        return {
            isVendor: true,
        };
    });

const Page = () => {
    const roles = [
        { id: 2, name: 'Super Admin' },
        { id: 3, name: 'Admin' },
        { id: 4, name: 'Trip Manager' },
    ];

    return (
        <Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'User'}
                        title="Users"
                        subtitle="Manage user here!"
                        viewAll={{
                            uri: `/vendor/api/v1/users`,
                            ignoredColumns: [
                                'id',
                                'password',
                                'type',
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
                            uri: `/vendor/api/v1/users`,
                        }}
                        viewOne={{ uri: '/vendor/api/v1/users/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/vendor/api/v1/users/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/vendor/api/v1/users/{id}',
                            identifier: '{id}',
                        }}
                        fields={getUserManagementFields(roles)}
                        editFields={getUserManagementFields(roles)
                            .filter(field => field.name !== 'password')
                            .map(field => (field.name !== 'email' ? { ...field } : { ...field, isDisabled: true }))}
                    />
                ),
                [roles]
            )}
        </Card>
    );
};

export default Page;

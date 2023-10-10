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
import { FilterComponent, PaginatorComponent } from '../../../components/';
import {
    generateQueryPath,
    getPaymentMethodOptions,
    getPaymentStatusOptions,
    getRevenueCategoryOptions,
    getSeverity,
} from '../../../utils';
import { DATE_FORMAT, getFormattedDatetime } from '../../../utils/date';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Revenues Management | Accounting | Vendor Panel | TripHaat', () => {
        return {
            isVendor: true,
        };
    });

const Page = () => {
    const router = useRouter();

    return (
        <Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Revenue'}
                        title="Revenues"
                        subtitle="Manage revenue here!"
                        viewAll={{
                            uri: `/vendor/api/v1/revenues${generateQueryPath('', null, router.query)}`,
                            ignoredColumns: ['id', 'vendorId', 'tripId', 'createdAt', 'updatedAt'],
                            scopedColumns: {
                                payDate: (item: any) => (
                                    <div>{getFormattedDatetime(item.payDate, DATE_FORMAT.DATE_REPORT)}</div>
                                ),
                                status: (item: any) => (
                                    <Badge value={item.status} size="large" severity={getSeverity(item.status)} />
                                ),
                            },
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/vendor/api/v1/revenues`,
                        }}
                        // viewOne={{ uri: '/vendor/api/v1/revenues/{id}', identifier: '{id}' }}
                        // editExisting={{ uri: '/vendor/api/v1/revenues/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/vendor/api/v1/revenues/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
                            {
                                type: 'text',
                                name: 'referenceNumber',
                                placeholder: 'Enter a reference number!',
                                title: 'Reference Number',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'receiveFrom',
                                placeholder: 'Enter a receive from name (Example: Customer Name)',
                                title: 'Receive From',
                                initialValue: null,
                                col: 2,
                            },
                            {
                                type: 'date',
                                name: 'receiveDate',
                                placeholder: 'Enter payment receive date!',
                                title: 'Payment Receive Date',
                                initialValue: null,
                            },
                            {
                                type: 'select-sync',
                                name: 'category',
                                placeholder: 'Select a category!',
                                title: 'Category',
                                initialValue: null,
                                options: getRevenueCategoryOptions(),
                                validate: (values: any) => {
                                    if (!values.category) return 'Required!';

                                    return null;
                                },
                                col: 2,
                            },
                            {
                                type: 'text',
                                name: 'description',
                                placeholder: 'Enter a description...',
                                title: 'Description',
                                initialValue: null,
                            },
                            {
                                type: 'number',
                                name: 'amount',
                                placeholder: 'Enter amount',
                                title: 'Amount',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.amount) return 'Required!';

                                    return null;
                                },
                                col: 2,
                            },
                            {
                                type: 'select-sync',
                                name: 'method',
                                placeholder: 'Select payment method...',
                                title: 'Payment Method',
                                initialValue: null,
                                options: getPaymentMethodOptions(),
                                validate: (values: any) => {
                                    if (!values.method) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'mfsMethod',
                                placeholder: 'Select MFS type!',
                                title: 'MFS Name',
                                initialValue: null,
                                options: [
                                    { value: 'bKash', label: 'bKash' },
                                    { value: 'Nagad', label: 'Nagad' },
                                    { value: 'Rocket', label: 'Rocket' },
                                    { value: 'Upay', label: 'Upay' },
                                    { value: 'SureCash', label: 'SureCash' },
                                    { value: 'mCash', label: 'mCash' },
                                    { value: 'MyCash', label: 'MyCash' },
                                    { value: 'Tap', label: 'Tap' },
                                    { value: 'FirstCash', label: 'FirstCash' },
                                    { value: 'OK Wallet', label: 'OK Wallet' },
                                    { value: 'TeleCash', label: 'TeleCash' },
                                    { value: 'Meghna Pay', label: 'Meghna Pay' },
                                ],
                                show: values => {
                                    if (values.method !== 'MFS') return false;

                                    return true;
                                },
                                validate: (values: any) => {
                                    if (!values.mfsMethod) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'otherMethod',
                                placeholder: 'Enter note (if applicable)!',
                                title: 'Other Type Payment Note',
                                initialValue: null,
                                show: values => {
                                    if (values.method !== 'OTHER') return false;

                                    return true;
                                },
                                validate: (values: any) => {
                                    if (!values.otherMethod) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'trxId',
                                placeholder: 'Enter transaction ID (if applicable)!',
                                title: 'Transaction ID',
                                initialValue: null,
                            },
                            {
                                type: 'textarea',
                                name: 'note',
                                placeholder: '',
                                title: 'Note',
                                initialValue: null,
                            },
                            {
                                type: 'select-sync',
                                name: 'status',
                                placeholder: 'Select revenue status!',
                                title: 'Status',
                                initialValue: 'COMPLETED',
                                options: getPaymentStatusOptions(),
                                validate: (values: any) => {
                                    if (!values.status) return 'Required!';

                                    return null;
                                },
                            },
                        ]}
                        filtration={
                            <FilterComponent
                                fields={[
                                    {
                                        type: 'text',
                                        name: 'search',
                                        placeholder:
                                            'Search by reference number, pay to, category, description, amount, transaction id or note',
                                        title: 'Search',
                                        initialValue: null,
                                        col: 3,
                                    },
                                    {
                                        type: 'select-sync',
                                        name: 'method',
                                        placeholder: 'Select payment method...',
                                        title: 'Payment Method',
                                        initialValue: null,
                                        options: getPaymentMethodOptions(),
                                    },
                                    {
                                        type: 'select-sync',
                                        name: 'status',
                                        placeholder: 'Select status!',
                                        title: 'Status',
                                        initialValue: null,
                                        options: getPaymentStatusOptions(),
                                    },
                                    {
                                        type: 'date',
                                        name: 'startDate',
                                        placeholder: 'Enter start date for date range filter...',
                                        title: 'Date Range (Start Date)',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.startDate && values.endDate)
                                                return 'Please select both date for range!';

                                            return null;
                                        },
                                        col: 2,
                                    },
                                    {
                                        type: 'date',
                                        name: 'endDate',
                                        placeholder: 'Enter start date for date range filter...',
                                        title: 'Date Range (End Date)',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (values.startDate && !values.endDate)
                                                return 'Please select both date for range!';

                                            return null;
                                        },
                                    },
                                ]}
                                router={router}
                            />
                        }
                        pagination={<PaginatorComponent router={router} />}
                    />
                ),
                [router]
            )}
        </Card>
    );
};

export default Page;

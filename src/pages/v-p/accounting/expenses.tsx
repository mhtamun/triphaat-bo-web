import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';
import {
    getExpenseCategoryOptions,
    getPaymentMethodOptions,
    getPaymentStatusOptions,
    getSeverity,
} from '../../../utils';
import { GenericFormGenerator } from '../../../components';
import { Fieldset } from 'primereact/fieldset';
import { DATE_FORMAT, getFormattedDatetime } from '../../../utils/date';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Expenses Management | Accounting | Vendor Panel | TripHaat', () => {
        return {
            isVendor: true,
        };
    });

const Page = () => {
    return (
        <Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Expense'}
                        title="Expenses"
                        subtitle="Manage expense here!"
                        viewAll={{
                            uri: `/vendor/api/v1/expenses`,
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
                            uri: `/vendor/api/v1/expenses`,
                        }}
                        // viewOne={{ uri: '/vendor/api/v1/expenses/{id}', identifier: '{id}' }}
                        // editExisting={{ uri: '/vendor/api/v1/expenses/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/vendor/api/v1/expenses/{id}',
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
                                name: 'payTo',
                                placeholder: 'Enter a pay to name (Example: Supplier Name)',
                                title: 'Pay To',
                                initialValue: null,
                                col: 2,
                            },
                            {
                                type: 'date',
                                name: 'payDate',
                                placeholder: 'Enter a pay date!',
                                title: 'Pay Date',
                                initialValue: null,
                            },
                            {
                                type: 'select-sync',
                                name: 'category',
                                placeholder: 'Select a category!',
                                title: 'Category',
                                initialValue: null,
                                options: getExpenseCategoryOptions(),
                                isGroupOptions: true,
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
                                placeholder: 'Select expense status!',
                                title: 'Status',
                                initialValue: 'COMPLETED',
                                options: getPaymentStatusOptions(),
                                validate: (values: any) => {
                                    if (!values.status) return 'Required!';

                                    return null;
                                },
                            },
                        ]}
                    />
                ),
                []
            )}
        </Card>
    );
};

export default Page;

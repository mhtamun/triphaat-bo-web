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
    getExpenseCategoryOptions,
    getPaymentMethodOptions,
    getPaymentStatusOptions,
    getSeverity,
} from '../../../utils';
import { DATE_FORMAT, getFormattedDatetime } from '../../../utils/date';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Statement | Accounting | Vendor Panel | TripHaat', () => {
        return {
            isVendor: true,
        };
    });

const Page = () => {
    const router = useRouter();
    const {
        startDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
        endDate = new Date().toISOString().split('T')[0] + 'T23:59:59.999Z',
    } = router.query;

    console.debug({ startDate, endDate });

    return (
        <Card
            title={'Statement'}
            subTitle={`Period From: ${(startDate as string).split('T')[0]} - ${(endDate as string).split('T')[0]}`}
        >
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Statement'}
                        title={``}
                        subtitle={``}
                        viewAll={{
                            uri: `/vendor/api/v1/accounting-statement${generateQueryPath('', null, {
                                startDate,
                                endDate,
                            })}`,
                            ignoredColumns: [],
                            scopedColumns: {
                                date: (item: any) => (
                                    <h6>{getFormattedDatetime(item.date, DATE_FORMAT.DATETIME_GENERAL_TABLE)}</h6>
                                ),
                                expense: (item: any) => <h5 style={{ color: 'red' }}>{item.expense}</h5>,
                                revenue: (item: any) => <h5 style={{ color: 'green' }}>{item.revenue}</h5>,
                                balance: (item: any) => <h6>BDT {item.balance}</h6>,
                                type: (item: any) => (
                                    <Badge value={item.type} size="large" severity={getSeverity(item.type)} />
                                ),
                            },
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        filtration={
                            <FilterComponent
                                fields={[
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

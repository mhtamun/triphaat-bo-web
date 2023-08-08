import React, { useMemo, useCallback, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericViewGenerator from '../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../apis';
import TabViewComponent from '../../../../components/trips/TabViewComponent';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Payments | Trip Management', async cookies => {
        const tripId = context.query.id;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetTrip || responseGetTrip.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/errors/500',
                    permanent: false,
                },
            };
        }

        return {
            isVendor: true,
            tripId,
            trip: responseGetTrip.data,
        };
    });

const Page = ({ tripId, trip }: { tripId: string; trip: any }) => {
    const router = useRouter();

    const [totalIn, setTotalIn] = useState<number>(0);
    const [totalOut, setTotalOut] = useState<number>(0);

    const getFormFields = useCallback((tripId: number, type: string) => {
        return [
            {
                type: 'hidden',
                name: 'tripId',
                placeholder: '',
                title: '',
                initialValue: tripId,
                validate: (values: any) => {
                    if (!values.tripId) return 'Required!';

                    return null;
                },
            },
            {
                type: 'hidden',
                name: 'type',
                placeholder: '',
                title: '',
                initialValue: type,
                validate: (values: any) => {
                    if (!values.type) return 'Required!';

                    return null;
                },
            },
            {
                type: 'number',
                name: 'amount',
                placeholder: 'Enter amount!',
                title: 'Amount',
                initialValue: null,
                validate: (values: any) => {
                    if (!values.amount) return 'Required!';

                    return null;
                },
            },
            {
                type: 'select-sync',
                name: 'currencyIsoCode',
                placeholder: 'Select a payment currency!',
                title: 'Currency',
                initialValue: 'BDT',
                options: [
                    { value: 'BDT', label: 'Bangladeshi Taka' },
                    { value: 'INR', label: 'Indian Rupee' },
                    { value: 'SAR', label: 'Saudi Arabian Riyal' },
                    { value: 'USD', label: 'US Dollar' },
                    { value: 'EUR', label: 'Euro' },
                    { value: 'GBP', label: 'British Pound Sterling' },
                    { value: 'AUD', label: 'Australian Dollar' },
                    { value: 'CAD', label: 'Canadian Dollar' },
                    { value: 'CHF', label: 'Swiss Franc' },
                    { value: 'CNY', label: 'Chinese Yuan Renminbi' },
                    { value: 'OTHER', label: 'Other' },
                ],
            },
            {
                type: 'number',
                name: 'conversionRate',
                placeholder: 'Enter conversion rate!',
                title: 'Conversion Rate',
                initialValue: 1,
            },
            {
                type: 'text',
                name: 'description',
                placeholder: 'Enter description!',
                title: 'Description',
                initialValue: null,
                validate: (values: any) => {
                    if (!values.description) return 'Required!';

                    return null;
                },
            },
            {
                type: 'date',
                name: 'date',
                placeholder: 'Enter date of the payment!',
                title: 'Date',
                initialValue: null,
                validate: (values: any) => {
                    if (!values.date) return 'Required!';

                    return null;
                },
            },
            {
                type: 'select-sync',
                name: 'method',
                placeholder: 'Select a payment method!',
                title: 'Method',
                initialValue: 'CASH',
                options: [
                    { value: 'CASH', label: 'Cash' },
                    { value: 'CREDIT_CARD', label: 'Credit Card' },
                    { value: 'DEBIT_CARD', label: 'Debit Card' },
                    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                    { value: 'BKASH', label: 'BKash' },
                    { value: 'NAGAD', label: 'Nagad' },
                    { value: 'ROCKET', label: 'Rocket' },
                    { value: 'UPAY', label: 'Upay' },
                    { value: 'SURE_CASH', label: 'Sure Cash' },
                    { value: 'M_CASH', label: 'M Cash' },
                    { value: 'MY_CASH', label: 'My Cash' },
                    { value: 'TAP', label: 'Tap (TBL)' },
                    { value: 'OTHER', label: 'Other' },
                ],
                validate: (values: any) => {
                    if (!values.method) return 'Required!';

                    return null;
                },
            },
            {
                type: 'text',
                name: 'otherMethod',
                placeholder: 'Enter other method of payment (if any)!',
                title: 'Other Method Of Payment (if any)',
                initialValue: null,
            },
            {
                type: 'select-sync',
                name: 'status',
                placeholder: 'Select status!',
                title: 'Status',
                initialValue: 'SUCCESSFUL',
                options: [
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'SUCCESSFUL', label: 'Successful' },
                    { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
                    { value: 'CANCELED', label: 'Canceled' },
                ],
                validate: (values: any) => {
                    if (!values.status) return 'Required!';

                    return null;
                },
            },
        ];
    }, []);

    console.debug(new Date().toISOString());

    return (
        <>
            <Card title={trip?.name}>
                <TabViewComponent
                    activeIndex={9}
                    router={router}
                    tripId={tripId}
                    content={
                        <>
                            <div className="grid">
                                <div
                                    className="col-6"
                                    style={{
                                        background: 'rgba(0, 255, 0, 0.3)',
                                    }}
                                >
                                    {useMemo(
                                        () => (
                                            <GenericViewGenerator
                                                name={'Payment (IN)'}
                                                title="Trip Payments (IN)"
                                                subtitle="Manage trip payments (inbound) here!"
                                                viewAll={{
                                                    uri: `/vendor/api/v1/trips/${tripId}/types/IN/trip-payments`,
                                                    ignoredColumns: [
                                                        'id',
                                                        'vendorId',
                                                        'tripId',
                                                        'type',
                                                        'invoiceNumber',
                                                        'orderNumber',
                                                        'additionalDetails',
                                                        'billingEmail',
                                                        'billingAddress',
                                                        'createdAt',
                                                        'updatedAt',
                                                    ],
                                                    actionIdentifier: 'id',
                                                    onDataModify: data =>
                                                        _.map(data, datum => ({
                                                            ...datum,
                                                        })),
                                                    onSuccess: data => {
                                                        console.debug({ data });

                                                        const totalIn = _.reduce(
                                                            data,
                                                            (result, datum, index) => {
                                                                return (
                                                                    result +
                                                                    parseFloat(datum.amount) *
                                                                        parseFloat(datum.conversionRate)
                                                                );
                                                            },
                                                            0
                                                        );

                                                        setTotalIn(totalIn);
                                                    },
                                                }}
                                                addNew={{
                                                    uri: `/vendor/api/v1/trip-payments`,
                                                    buttonText: 'Receive Payment',
                                                }}
                                                // viewOne={{ uri: '/vendor/api/v1/trip-payments/{id}', identifier: '{id}' }}
                                                // editExisting={{
                                                //     uri: '/vendor/api/v1/trip-payments/{id}',
                                                //     identifier: '{id}',
                                                // }}
                                                // removeOne={{
                                                //     uri: '/vendor/api/v1/trip-payments/{id}',
                                                //     identifier: '{id}',
                                                // }}
                                                fields={getFormFields(parseInt(tripId), 'IN')}
                                            />
                                        ),
                                        [trip]
                                    )}
                                    <div
                                        className="mt-3"
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.3)',
                                        }}
                                    >
                                        <DataTable
                                            value={[{ totalIn: totalIn.toFixed(2) }]}
                                            columnResizeMode="expand"
                                            resizableColumns
                                            showGridlines
                                            scrollable
                                            tableStyle={{ minWidth: '50%' }}
                                        >
                                            <Column field="totalIn" header={'Total In (BDT)'} />
                                        </DataTable>
                                    </div>
                                </div>
                                <div
                                    className="col-6"
                                    style={{
                                        background: 'rgba(255, 0, 0, 0.3)',
                                    }}
                                >
                                    {useMemo(
                                        () => (
                                            <GenericViewGenerator
                                                name={'Payment (OUT)'}
                                                title="Trip Payments (OUT)"
                                                subtitle="Manage trip payments (outbound) here!"
                                                viewAll={{
                                                    uri: `/vendor/api/v1/trips/${tripId}/types/OUT/trip-payments`,
                                                    ignoredColumns: [
                                                        'id',
                                                        'vendorId',
                                                        'tripId',
                                                        'type',
                                                        'invoiceNumber',
                                                        'orderNumber',
                                                        'additionalDetails',
                                                        'billingEmail',
                                                        'billingAddress',
                                                        'createdAt',
                                                        'updatedAt',
                                                    ],
                                                    actionIdentifier: 'id',
                                                    onDataModify: data =>
                                                        _.map(data, datum => ({
                                                            ...datum,
                                                        })),
                                                    onSuccess: data => {
                                                        console.debug({ data });

                                                        const totalOut = _.reduce(
                                                            data,
                                                            (result, datum, index) => {
                                                                return (
                                                                    result +
                                                                    parseFloat(datum.amount) *
                                                                        parseFloat(datum.conversionRate)
                                                                );
                                                            },
                                                            0
                                                        );

                                                        setTotalOut(totalOut);
                                                    },
                                                }}
                                                addNew={{
                                                    uri: `/vendor/api/v1/trip-payments`,
                                                    buttonText: 'Drop Payment',
                                                }}
                                                // viewOne={{ uri: '/vendor/api/v1/trip-payments/{id}', identifier: '{id}' }}
                                                // editExisting={{
                                                //     uri: '/vendor/api/v1/trip-payments/{id}',
                                                //     identifier: '{id}',
                                                // }}
                                                // removeOne={{
                                                //     uri: '/vendor/api/v1/trip-payments/{id}',
                                                //     identifier: '{id}',
                                                // }}
                                                fields={getFormFields(parseInt(tripId), 'OUT')}
                                            />
                                        ),
                                        [trip]
                                    )}
                                    <div
                                        className="mt-3"
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.3)',
                                        }}
                                    >
                                        <DataTable
                                            value={[{ totalOut: totalOut.toFixed(2) }]}
                                            columnResizeMode="expand"
                                            resizableColumns
                                            showGridlines
                                            scrollable
                                            tableStyle={{ minWidth: '50%' }}
                                        >
                                            <Column field="totalOut" header={'Total Out (BDT)'} />
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <Message
                                className="mt-3"
                                severity={parseFloat((totalIn - totalOut).toFixed(2)) > 0 ? 'success' : 'error'}
                                content={`Balance: BDT ${(totalIn - totalOut).toFixed(2)}`}
                            />
                        </>
                    }
                />
            </Card>
        </>
    );
};

export default Page;

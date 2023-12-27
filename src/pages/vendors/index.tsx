import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { PrimeIcons } from 'primereact/api';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getMonths, getVendorStatusOptions } from '../../utils';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context, 'Vendor Management');

const Page = () => {
    const router = useRouter();

    return (
        <Card>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Vendor'}
                        title="Vendors"
                        subtitle="Manage vendors here!"
                        viewAll={{
                            uri: `/api/v1/vendors`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            scopedColumns: {
                                logoImageUrl: (item: any) => (
                                    <>
                                        <span className="p-column-title">{item.title}</span>
                                        <img src={item.logoImageUrl} alt="" className="shadow-2" width="100" />
                                    </>
                                ),
                                licenseImageUrl: (item: any) => (
                                    <>
                                        <span className="p-column-title">{item.title}</span>
                                        <img src={item.licenseImageUrl} alt="" className="shadow-2" width="100" />
                                    </>
                                ),
                                responsiblePersonImageUrl: (item: any) => (
                                    <>
                                        <span className="p-column-title">{item.title}</span>
                                        <img
                                            src={item.responsiblePersonImageUrl}
                                            alt=""
                                            className="shadow-2"
                                            width="100"
                                        />
                                    </>
                                ),
                                responsiblePersonNIDImageUrl: (item: any) => (
                                    <>
                                        <span className="p-column-title">{item.title}</span>
                                        <img
                                            src={item.responsiblePersonNIDImageUrl}
                                            alt=""
                                            className="shadow-2"
                                            width="100"
                                        />
                                    </>
                                ),
                                status: (item: any) => (
                                    <>
                                        <Badge
                                            value={item.status}
                                            size="large"
                                            severity={item.status === 'BANNED' ? 'danger' : 'success'}
                                        ></Badge>
                                    </>
                                ),
                            },
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    onSeasonMonths: _.join(datum.onSeasonMonths, ', '),
                                    offSeasonMonths: _.join(datum.offSeasonMonths, ', '),
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/vendors`,
                        }}
                        viewOne={{
                            uri: '/api/v1/vendors/{id}',
                            identifier: '{id}',
                            onDataModify: datum => ({
                                ...datum,
                                manualBookingCommission: parseFloat(datum.manualBookingCommission),
                                onlyPgwUseCommission: parseFloat(datum.onlyPgwUseCommission),
                                websiteBookingOnCommission: parseFloat(datum.websiteBookingOnCommission),
                                websiteBookingOffCommission: parseFloat(datum.websiteBookingOffCommission),
                            }),
                        }}
                        editExisting={{ uri: '/api/v1/vendors/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/vendors/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.ARROW_RIGHT,
                                text: 'Users',
                                callback: identifier => {
                                    router.push(`/vendors/${identifier}/users`);
                                },
                            },
                        ]}
                        fields={[
                            {
                                type: 'text',
                                name: 'businessName',
                                placeholder: 'Enter business name!',
                                title: 'Business Name',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.businessName) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'businessAddress',
                                placeholder: 'Enter business address!',
                                title: 'Business Address',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.businessAddress) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'email',
                                name: 'email',
                                placeholder: 'Enter an email!',
                                title: 'Email',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.email) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'phone',
                                placeholder: 'Enter a phone number!',
                                title: 'Phone Number',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.phone) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'manualBookingCommission',
                                placeholder: '',
                                title: 'Manual Booking Commission',
                                initialValue: 0,
                                validate: (values: any) => {
                                    if (
                                        _.isUndefined(values.manualBookingCommission) ||
                                        _.isNull(values.manualBookingCommission)
                                    )
                                        return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'onlyPgwUseCommission',
                                placeholder: '',
                                title: 'Only Pgw Use Commission',
                                initialValue: 0,
                                validate: (values: any) => {
                                    if (
                                        _.isUndefined(values.onlyPgwUseCommission) ||
                                        _.isNull(values.onlyPgwUseCommission)
                                    )
                                        return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'websiteBookingOnCommission',
                                placeholder: '',
                                title: 'Website Booking On Season Commission',
                                initialValue: 0,
                                validate: (values: any) => {
                                    if (
                                        _.isUndefined(values.websiteBookingOnCommission) ||
                                        _.isNull(values.websiteBookingOnCommission)
                                    )
                                        return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'number',
                                name: 'websiteBookingOffCommission',
                                placeholder: '',
                                title: 'Website Booking Off Season Commission',
                                initialValue: 0,
                                validate: (values: any) => {
                                    if (
                                        _.isUndefined(values.websiteBookingOffCommission) ||
                                        _.isNull(values.websiteBookingOffCommission)
                                    )
                                        return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'multi-select-sync',
                                name: 'onSeasonMonths',
                                placeholder: 'Select on season months!',
                                title: 'On Season Months',
                                initialValue: null,
                                options: getMonths(),
                                validate: (values: any) => {
                                    if (_.size(values.onSeasonMonths) === 0) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'multi-select-sync',
                                name: 'offSeasonMonths',
                                placeholder: 'Select off season months!',
                                title: 'Off Season Months',
                                initialValue: null,
                                options: getMonths(),
                                validate: (values: any) => {
                                    if (_.size(values.offSeasonMonths) === 0) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'status',
                                placeholder: 'Select status!',
                                title: 'Status',
                                initialValue: 'ACTIVE',
                                options: getVendorStatusOptions(),
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

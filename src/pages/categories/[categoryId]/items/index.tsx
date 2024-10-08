import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { RedirectType, redirect } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericViewGenerator from '../../../../components/global/GenericViewGenerator';
import { DATE_FORMAT, getFormattedDatetime } from '../../../../utils/date';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Itineraries | Client Section', async cookies => {
        const categoryId = context.query.categoryId as string;

        return {
            isVendor: false,
            categoryId: parseInt(categoryId),
        };
    });

const Page = ({ categoryId }: { categoryId: number }) => {
    const router = useRouter();

    return (
        <Card title="Items" subTitle="">
            <Button
                label={'Create New Item'}
                icon="pi pi-plus"
                severity="success"
                className="mb-3"
                onClick={e => {
                    e.preventDefault();

                    router.push(`/categories/${router.query.categoryId}/items/create`);
                }}
            />
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Item'}
                        viewAll={{
                            uri: `/api/v1/categories/${categoryId}/trips`,
                            ignoredColumns: [
                                'id',
                                'vendorId',
                                'slug',
                                'dateType',
                                'dateTypeOther',
                                'accommodationType',
                                'accommodationTypeOther',
                                'transportationType',
                                'transportationTypeOther',
                                'foodType',
                                'foodTypeOther',
                                'smallDescription',
                                'bigDescription',
                                'createdAt',
                                'updatedAt',
                            ],
                            scopedColumns: {
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
                                    startDate: !datum.startDate
                                        ? null
                                        : getFormattedDatetime(datum.startDate, DATE_FORMAT.DATE_REPORT),
                                    endDate: !datum.endDate
                                        ? null
                                        : getFormattedDatetime(datum.endDate, DATE_FORMAT.DATE_REPORT),
                                    expiryDateOfBooking: !datum.expiryDateOfBooking
                                        ? null
                                        : getFormattedDatetime(datum.expiryDateOfBooking, DATE_FORMAT.DATE_REPORT),
                                })),
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.ARROW_RIGHT,
                                text: '',
                                tooltip: 'Enter Detail',
                                callback: identifier => {
                                    router.push(`/categories/${categoryId}/items/${identifier}`);
                                },
                            },
                        ]}
                    />
                ),
                [router]
            )}
        </Card>
    );
};

export default Page;

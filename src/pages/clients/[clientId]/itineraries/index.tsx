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
        const clientId = context.query.clientId as string;

        return {
            isVendor: false,
            clientId: parseInt(clientId),
        };
    });

const Page = ({ clientId }: { clientId: number }) => {
    const router = useRouter();

    return (
        <Card title="Trips" subTitle="Manage trips here!">
            <Button
                label={'Create New Trip'}
                icon="pi pi-plus"
                severity="success"
                className="mb-3"
                onClick={e => {
                    e.preventDefault();

                    router.push(`/v-p/trips/t/${router.query.type}/create`);
                }}
            />
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Trip'}
                        viewAll={{
                            uri: `/api/v1/clients/${clientId}/trips`,
                            ignoredColumns: [
                                'id',
                                'vendorId',
                                'locationId',
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
                                    router.push(`/clients/${clientId}/itineraries/${identifier}`);
                                },
                            },
                            {
                                color: 'info',
                                icon: PrimeIcons.INFO,
                                text: '',
                                tooltip: 'Enter Preview',
                                callback: identifier => {},
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

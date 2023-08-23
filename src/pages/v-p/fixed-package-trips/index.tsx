import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Trip Management', () => {
        return {
            isVendor: true,
        };
    });

const Page = () => {
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

                    router.push(`/v-p/fixed-package-trips/create`);
                }}
            />
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Trip'}
                        viewAll={{
                            uri: `/vendor/api/v1/date-types/FIXED/accommodation-types/FIXED/transportation-types/FIXED/trips`,
                            ignoredColumns: ['id', 'smallDescription', 'bigDescription', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.ARROW_RIGHT,
                                text: 'Detail',
                                callback: identifier => {
                                    router.push(`/v-p/fixed-package-trips/${identifier}`);
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

import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context, 'Trip Management');

const Page = () => {
    const router = useRouter();

    return (
        <>
            <div className="card">
                <Button
                    label={'New'}
                    icon="pi pi-plus"
                    severity="success"
                    className=" mr-2"
                    onClick={e => {
                        router.push(`/trips/create`);
                    }}
                />
            </div>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Trip'}
                        title="Trips"
                        subtitle="Manage trips here!"
                        viewAll={{
                            uri: `/api/v1/trips`,
                            ignoredColumns: ['id', 'smallDescription', 'bigDescription', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    trips: null,
                                })),
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.ARROW_RIGHT,
                                text: 'Detail',
                                callback: identifier => {
                                    router.push(`/trips/${identifier}`);
                                },
                            },
                        ]}
                    />
                ),
                []
            )}
        </>
    );
};

export default Page;

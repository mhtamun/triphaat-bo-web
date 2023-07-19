import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context);

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
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    trips: null,
                                })),
                        }}
                    />
                ),
                []
            )}
        </>
    );
};

export default Page;

import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import GenericViewGenerator from '../../../components/global/GenericViewGenerator';
import { getNavItemFields } from '..';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Featured Nav Item Management | Admin Panel | TripHaat', cookies => {
        const parentId = context.query._id as string;

        return {
            isVendor: false,
            parentId,
        };
    });

const Page = ({ parentId }: { parentId: string }) => {
    const router = useRouter();

    return (
        <Card title="" subTitle="">
            <Button
                label="Back"
                icon={PrimeIcons.ARROW_LEFT}
                severity="info"
                className="mb-3"
                onClick={e => {
                    e.preventDefault();

                    router.back();
                }}
            />
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Featured Navigation Item'}
                        title={'Featured Navigation Item'}
                        subtitle={'Manage featured navigation items here!'}
                        viewAll={{
                            uri: `/api/v1/parent/${parentId}/featured-nav-items`,
                            ignoredColumns: ['_id', '__v', 'createdAt', 'updatedAt'],
                            actionIdentifier: '_id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    children: null,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/featured-nav-items`,
                        }}
                        viewOne={{ uri: '/api/v1/featured-nav-items/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/featured-nav-items/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/featured-nav-items/{id}',
                            identifier: '{id}',
                        }}
                        customActions={[
                            {
                                color: 'info',
                                icon: PrimeIcons.ARROW_RIGHT,
                                text: 'Sub Sub Items',
                                callback: identifier => {
                                    router.push(`/featured-nav-items/${identifier}?layer=3`);
                                },
                            },
                        ]}
                        fields={[
                            ...getNavItemFields(),
                            {
                                type: 'hidden',
                                name: 'parent',
                                placeholder: '',
                                title: '',
                                initialValue: parentId,
                                validate: (values: any) => {
                                    if (!values.parent) return 'Required!';

                                    return null;
                                },
                            },
                        ]}
                    />
                ),
                [parentId]
            )}
        </Card>
    );
};

export default Page;

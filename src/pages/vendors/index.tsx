import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../utils';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context);

const Page = () => {
    return (
        <>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Vendor'}
                        title="Vendors"
                        subtitle="Manage vendors here!"
                        viewAll={{
                            uri: `/api/v1/vendors`,
                            ignoredColumns: ['id', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/vendors`,
                        }}
                        viewOne={{ uri: '/api/v1/vendors/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/vendors/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/vendors/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
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

                                    if (values.phone && !values.phone.startsWith('+880'))
                                        return 'Please enter code +880 before number!';

                                    return null;
                                },
                            },
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
                                type: 'text',
                                name: 'responsiblePersonName',
                                placeholder: 'Enter responsible person name!',
                                title: 'Responsible Person Name',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.responsiblePersonName) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'responsiblePersonEmail',
                                placeholder: 'Enter responsible person email address!',
                                title: 'Responsible Person Email Address',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.responsiblePersonEmail) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'responsiblePersonPhone',
                                placeholder: 'Enter responsible person phone number!',
                                title: 'Responsible Person Phone Number',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.responsiblePersonPhone) return 'Required!';

                                    if (values.phone && !values.phone.startsWith('+880'))
                                        return 'Please enter code +880 before number!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'responsiblePersonNid',
                                placeholder: 'Enter responsible person NID number!',
                                title: 'Responsible Person NID Number',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.responsiblePersonNid) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'status',
                                placeholder: 'Select status!',
                                title: 'Status',
                                initialValue: 'ACTIVE',
                                options: getGeneralStatusOptions(),
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
        </>
    );
};

export default Page;

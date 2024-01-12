import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import GenericViewGenerator from '../../../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../../../apis';
import { getGeneralStatusOptions } from '../../../../../../utils';
import TabViewComponent from '../../../../../../components/trips/TabViewComponent';
import WrapperComponent from '../../../../../../components/trips/WrapperComponent';
import { IField } from '../../../../../../components/global/GenericFormGenerator';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Videos | Fixed package Trip Management', async cookies => {
        const tripId = context.query.tripId;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetTrip || responseGetTrip.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
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

    const fields: IField[] = [
        {
            type: 'hidden',
            name: 'tripId',
            placeholder: '',
            title: '',
            initialValue: parseInt(tripId),
            validate: (values: any) => {
                if (!values.tripId) return 'Required!';

                return null;
            },
        },
        {
            type: 'file-select',
            name: 'url',
            placeholder: 'Select video file!',
            title: 'Video Upload',
            initialValue: null,
            acceptType: 'video/*',
            maxFileSize: 5242880,
            validate: (values: any) => {
                if (!values.url) return 'Required!';

                return null;
            },
        },
        {
            type: 'text',
            name: 'title',
            placeholder: 'Enter title for this image!',
            title: 'Title',
            initialValue: null,
        },
        {
            type: 'text',
            name: 'description',
            placeholder: 'Enter description for this image!',
            title: 'Description',
            initialValue: null,
        },
        {
            type: 'number',
            name: 'serial',
            placeholder: 'Enter serial number for sorting!',
            title: 'Serial',
            initialValue: 9999,
            validate: (values: any) => {
                if (!values.serial) return 'Required!';

                return null;
            },
            col: 2,
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
    ];

    return (
        <WrapperComponent tripId={tripId} title={trip?.name} router={router}>
            <TabViewComponent
                router={router}
                tripId={tripId}
                content={useMemo(
                    () => (
                        <GenericViewGenerator
                            name={'Video'}
                            title="Trip Videos"
                            subtitle="Manage trip videos here!"
                            viewAll={{
                                uri: `/api/v1/trips/${tripId}/videos`,
                                ignoredColumns: ['id', 'tripId', 'createdAt', 'updatedAt'],
                                scopedColumns: {
                                    url: (item: any) => (
                                        <>
                                            <span className="p-column-title">{item.title}</span>
                                            <video src={item.url} className="shadow-2" width="100" />
                                        </>
                                    ),
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
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/videos`,
                                buttonText: 'Add Video',
                            }}
                            viewOne={{ uri: '/api/v1/videos/{id}', identifier: '{id}' }}
                            editExisting={{ uri: '/api/v1/videos/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/videos/{id}',
                                identifier: '{id}',
                            }}
                            fields={fields}
                            editFields={[
                                {
                                    type: 'textarea',
                                    name: 'url',
                                    placeholder: 'Insert an video URL',
                                    title: 'Video Upload',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.url) return 'Required!';

                                        return null;
                                    },
                                },
                                ..._.filter(fields, (field: IField) => field.name !== 'url'),
                            ]}
                        />
                    ),
                    [trip]
                )}
            />
        </WrapperComponent>
    );
};

export default Page;

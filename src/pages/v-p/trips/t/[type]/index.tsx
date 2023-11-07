import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { PrimeIcons } from 'primereact/api';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../libs/auth';
import GenericViewGenerator from '../../../../../components/global/GenericViewGenerator';
import { getLocations } from '../../../../../apis';
import { DATE_FORMAT, getFormattedDatetime } from '../../../../../utils/date';
import { generateQueryPath, getGeneralStatusOptions, getTripType } from '../../../../../utils';
import { FilterComponent, PaginatorComponent } from '../../../../../components';
import { ILocation } from './create';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Trips | Trip Management', async cookies => {
        const responseGetLocations = await getLocations(`${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetLocations || responseGetLocations.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        // console.debug(responseGetLocations.data);

        return {
            isVendor: true,
            locations: responseGetLocations.data,
        };
    });

const Page = ({ locations }: { locations: ILocation[] }) => {
    const router = useRouter();
    // console.debug({ query: router.query });

    const types = getTripType(router);

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
                            uri: `/vendor/api/v1/date-types/${types.dateType}/accommodation-types/${
                                types.accommodationType
                            }/transportation-types/${types.transportationType}/trips${generateQueryPath(
                                '',
                                { type: router.query.type },
                                { ..._.omit(router.query, ['type']) }
                            )}`,
                            ignoredColumns: [
                                'id',
                                'vendorId',
                                'locationId',
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
                                tooltip: 'Enter trip management',
                                callback: identifier => {
                                    router.push(`/v-p/trips/${identifier}/t/${router.query.type}`);
                                },
                            },
                        ]}
                        filtration={
                            <FilterComponent
                                fields={[
                                    {
                                        type: 'text',
                                        name: 'search',
                                        placeholder: 'Search by name...',
                                        title: 'Search',
                                        initialValue: null,
                                        col: 2,
                                    },
                                    {
                                        type: 'select-sync',
                                        name: 'locationId',
                                        placeholder: 'Select a location for trip!',
                                        title: 'Location',
                                        initialValue: null,
                                        options: _.map(locations, (location: ILocation) => ({
                                            value: location.id,
                                            label: `${location.name}, ${location.city.name}, ${location.city.state.name}, ${location.city.state.country.name}`,
                                        })),
                                    },
                                    {
                                        type: 'date',
                                        name: 'startDate',
                                        placeholder: 'Enter start date for date range filter...',
                                        title: 'Date Range (Start Date)',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.startDate && values.endDate)
                                                return 'Please select both date for range!';

                                            return null;
                                        },
                                        col: 2,
                                    },
                                    {
                                        type: 'date',
                                        name: 'endDate',
                                        placeholder: 'Enter start date for date range filter...',
                                        title: 'Date Range (End Date)',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (values.startDate && !values.endDate)
                                                return 'Please select both date for range!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'select-sync',
                                        name: 'status',
                                        placeholder: 'Select status!',
                                        title: 'Status',
                                        initialValue: null,
                                        options: getGeneralStatusOptions(),
                                    },
                                ]}
                                router={router}
                                pathParams={{ type: router.query.type }}
                            />
                        }
                        pagination={<PaginatorComponent router={router} pathParams={{ type: router.query.type }} />}
                    />
                ),
                [router]
            )}
        </Card>
    );
};

export default Page;

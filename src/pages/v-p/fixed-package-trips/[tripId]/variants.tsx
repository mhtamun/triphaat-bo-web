import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericViewGenerator from '../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../apis';
import { getGeneralStatusOptions } from '../../../../utils';
import TabViewComponent from '../../../../components/trips/TabViewComponent';
import WrapperComponent from '../../../../components/trips/WrapperComponent';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Variants | Trip Management', async cookies => {
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

    return (
        <WrapperComponent tripId={tripId} title={trip?.name} router={router}>
            <TabViewComponent
                activeIndex={1}
                router={router}
                tripId={tripId}
                content={useMemo(
                    () => (
                        <GenericViewGenerator
                            name={'Variant'}
                            title="Trip Variants"
                            subtitle="Manage trip variants here!"
                            viewAll={{
                                uri: `/api/v1/trips/${tripId}/variants`,
                                ignoredColumns: [
                                    'id',
                                    'tripId',
                                    'accommodations',
                                    'accommodationType',
                                    'accommodationClass',
                                    'accommodationSharing',
                                    'transportations',
                                    'transportationType',
                                    'transportationClass',
                                    'transportationSharing',
                                    'foodType',
                                    'foodClass',
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
                                        id: datum.id,
                                        reasons: _.join(datum.otherReasons, ', '),
                                        costPrice: parseFloat(datum.costPricePerPerson),
                                        price: parseFloat(datum.pricePerPerson),
                                        offerPrice: parseFloat(datum.offerPricePerPerson),
                                        minimumTravelerRequired: datum.minRequiredTraveler,
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/variants`,
                                buttonText: 'Add Variant',
                            }}
                            viewOne={{
                                uri: '/api/v1/variants/{id}',
                                identifier: '{id}',
                                // Prisma returning decimal values as string, so needed to parse to float
                                onDataModify: datum => ({
                                    ...datum,
                                    costPricePerPerson: parseFloat(datum.costPricePerPerson),
                                    pricePerPerson: parseFloat(datum.pricePerPerson),
                                    offerPricePerPerson: parseFloat(datum.offerPricePerPerson),
                                }),
                            }}
                            editExisting={{ uri: '/api/v1/variants/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/variants/{id}',
                                identifier: '{id}',
                            }}
                            fields={[
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
                                    type: 'multi-select-sync',
                                    name: 'accommodationType',
                                    placeholder: 'Select accommodation type for this variant!',
                                    title: 'Accommodation Type',
                                    initialValue: null,
                                    options: [
                                        { label: 'Hotel', value: 'Hotel' },
                                        { label: 'Motel', value: 'Motel' },
                                        { label: 'Resort', value: 'Resort' },
                                        { label: 'Cottage', value: 'Cottage' },
                                        { label: 'Apartment', value: 'Apartment' },
                                        { label: 'Houseboat', value: 'Houseboat' },
                                    ],
                                    show: () => false,
                                },
                                {
                                    type: 'multi-select-sync',
                                    name: 'accommodationClass',
                                    placeholder: 'Select accommodation class for this variant!',
                                    title: 'Accommodation Class',
                                    initialValue: null,
                                    options: [
                                        { label: 'AC Accommodation', value: 'AC Accommodation' },
                                        { label: 'Non-AC Accommodation', value: 'Non-AC Accommodation' },
                                        { label: '2 Star', value: '2 Star' },
                                        { label: '3 Star', value: '3 Star' },
                                        { label: '4 Star', value: '4 Star' },
                                        { label: '5 Star', value: '5 Star' },
                                        { label: '7 Star', value: '7 Star' },
                                    ],
                                    show: () => false,
                                },
                                {
                                    type: 'multi-select-sync',
                                    name: 'accommodationSharing',
                                    placeholder: 'Select accommodation sharing for this variant!',
                                    title: 'Accommodation Sharing',
                                    initialValue: null,
                                    options: [
                                        { label: 'Couple (2 person sharing)', value: 'Couple (2 person sharing)' },
                                        { label: '3 person sharing', value: '3 person sharing' },
                                        { label: '4 person sharing', value: '4 person sharing' },
                                        { label: '5 person sharing', value: '5 person sharing' },
                                        { label: '6 person sharing', value: '6 person sharing' },
                                        {
                                            label: 'No sharing (1 Person sharing)',
                                            value: 'No sharing (1 Person sharing)',
                                        },
                                    ],
                                    show: () => false,
                                },
                                {
                                    type: 'multi-select-sync',
                                    name: 'transportationType',
                                    placeholder: 'Select transportation type for this variant!',
                                    title: 'Transportation Type',
                                    initialValue: null,
                                    options: [
                                        { label: '2 Seater Vehicle', value: '2 Seater Vehicle' },
                                        { label: '4 Seater Sedan', value: '4 Seater Sedan' },
                                        { label: '4 Seater SUV (Jeep)', value: '4 Seater SUV (Jeep)' },
                                        { label: '4 Seater Premium Car', value: '4 Seater Premium Car' },
                                        { label: '7 Seater Car', value: '7 Seater Car' },
                                        { label: '10 Seater Microbus', value: '10 Seater Microbus' },
                                        { label: '30 Seater Minibus', value: '30 Seater Minibus' },
                                        { label: '27 Seater (Luxury) Bus', value: '27 Seater (Luxury) Bus' },
                                        { label: '36 Seater Bus', value: '36 Seater Bus' },
                                        { label: 'Airplane', value: 'Airplane' },
                                        { label: 'Speed Boat', value: 'Speed Boat' },
                                        { label: 'Ship', value: 'Ship' },
                                        { label: 'Cruise Ship', value: 'Cruise Ship' },
                                    ],
                                    show: () => false,
                                },
                                {
                                    type: 'multi-select-sync',
                                    name: 'transportationClass',
                                    placeholder: 'Select transportation class for this variant!',
                                    title: 'Transportation Class',
                                    initialValue: null,
                                    options: [
                                        { label: 'AC Transportation', value: 'AC Transportation' },
                                        { label: 'Non-AC Transportation', value: 'Non-AC Transportation' },
                                        { label: 'First Class', value: 'First Class' },
                                        { label: 'Business Class', value: 'Business Class' },
                                        { label: 'Economy Class', value: 'Economy Class' },
                                    ],
                                    show: () => false,
                                },
                                {
                                    type: 'multi-select-sync',
                                    name: 'transportationSharing',
                                    placeholder: 'Select transportation sharing for this variant!',
                                    title: 'Transportation Sharing',
                                    initialValue: null,
                                    options: [
                                        { label: 'Couple (2 person sharing)', value: 'Couple (2 person sharing)' },
                                        { label: '3 person sharing', value: '3 person sharing' },
                                        { label: '4 person sharing', value: '4 person sharing' },
                                        { label: '5 person sharing', value: '5 person sharing' },
                                        { label: '6 person sharing', value: '6 person sharing' },
                                        {
                                            label: 'No sharing (1 Person sharing)',
                                            value: 'No sharing (1 Person sharing)',
                                        },
                                    ],
                                    show: () => false,
                                },
                                {
                                    type: 'multi-select-sync',
                                    name: 'foodType',
                                    placeholder: 'Select food type for this variant!',
                                    title: 'Food Type',
                                    initialValue: null,
                                    options: [],
                                    show: () => false,
                                },
                                {
                                    type: 'multi-select-sync',
                                    name: 'foodClass',
                                    placeholder: 'Select food class for this variant!',
                                    title: 'Food Class',
                                    initialValue: null,
                                    options: [],
                                    show: () => false,
                                },
                                {
                                    type: 'chips',
                                    name: 'otherReasons',
                                    placeholder: 'Enter reasons (press enter to start new line)!',
                                    title: 'Reasons',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (
                                            _.size(values.accommodationType) === 0 &&
                                            _.size(values.accommodationClass) === 0 &&
                                            _.size(values.accommodationSharing) === 0 &&
                                            _.size(values.transportationType) === 0 &&
                                            _.size(values.transportationClass) === 0 &&
                                            _.size(values.transportationSharing) === 0 &&
                                            _.size(values.foodType) === 0 &&
                                            _.size(values.foodClass) === 0 &&
                                            !values.otherReasons
                                        )
                                            return 'Please at least define what differs this variant from other variants!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'number',
                                    name: 'costPricePerPerson',
                                    placeholder: 'Enter cost price (per person)!',
                                    title: 'Cost Price (Per Person)',
                                    initialValue: null,
                                },
                                {
                                    type: 'number',
                                    name: 'pricePerPerson',
                                    placeholder: 'Enter price (price person)!',
                                    title: 'Price (Per Person)',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.pricePerPerson) return 'Required!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'number',
                                    name: 'offerPricePerPerson',
                                    placeholder: 'Enter offer price (person)!',
                                    title: 'Offer Price (Per Person)',
                                    initialValue: null,
                                },
                                {
                                    type: 'number',
                                    name: 'minRequiredTraveler',
                                    placeholder: 'Enter minimum number of traveler required for this variant!',
                                    title: 'Minimum Required Traveler',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.minRequiredTraveler) return 'Required!';

                                        return null;
                                    },
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

import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import GenericViewGenerator from '../../../../../../components/global/GenericViewGenerator';
import { getTripForVendor } from '../../../../../../apis';
import { getGeneralStatusOptions, getVariantOptions } from '../../../../../../utils';
import TabViewComponent from '../../../../../../components/trips/TabViewComponent';
import WrapperComponent from '../../../../../../components/trips/WrapperComponent';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Variants | Trip Management', async cookies => {
        const tripId = context.query.tripId as string;

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
                                    'foods',
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
                                        ...datum,
                                        // id: datum.id,
                                        reasons: _.join(datum.reasons, ', '),
                                        otherReasons: datum.otherReasons,
                                        // costPrice: parseFloat(datum.costPricePerPerson),
                                        // price: parseFloat(datum.pricePerPerson),
                                        // offerPrice: parseFloat(datum.offerPricePerPerson),
                                        // minimumTravelerRequired: datum.minRequiredTraveler,
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
                                    type: 'multi-select-sync',
                                    name: 'reasons',
                                    placeholder: 'Enter diversity reasons (press enter to start new line)!',
                                    title: 'Diversification Reasons (Click to select from the list)',
                                    initialValue: null,
                                    options: getVariantOptions(),
                                    isGroupOptions: true,
                                    validate: (values: any) => {
                                        if (!values.otherReasons && !values.reasons)
                                            return 'Please at least select what differs this variant from other variants!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'text',
                                    name: 'otherReasons',
                                    placeholder: 'Write reasons for this variant',
                                    title: 'Diversification Reasons (Write in plain text)',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.reasons && !values.otherReasons)
                                            return 'Please at least write what differs this variant from other variants!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'number',
                                    name: 'costPricePerPerson',
                                    placeholder: 'Enter cost price per person!',
                                    title: 'Cost Price Per Person (Estimated)',
                                    initialValue: null,
                                },
                                {
                                    type: 'text',
                                    name: 'adultPriceNote',
                                    placeholder: '',
                                    title: 'Adult Price Note',
                                    initialValue: `5+ years? Now in adults category.`,
                                },
                                {
                                    type: 'number',
                                    name: 'pricePerPerson',
                                    placeholder: 'Enter price price per person!',
                                    title: 'Adult Price Per Person',
                                    initialValue: null,
                                    validate: (values: any) => {
                                        if (!values.pricePerPerson) return 'Required!';

                                        return null;
                                    },
                                },
                                {
                                    type: 'number',
                                    name: 'offerPricePerPerson',
                                    placeholder: 'Enter offer price per person!',
                                    title: 'Adult Offer Price Per Person',
                                    initialValue: 0.0,
                                },
                                {
                                    type: 'number',
                                    name: 'kidAgeUpto',
                                    placeholder: 'Enter kid age upto',
                                    title: 'Kid Age Upto',
                                    initialValue: 5.0,
                                },
                                {
                                    type: 'text',
                                    name: 'kidPriceNote',
                                    placeholder: '',
                                    title: 'Kid Price Note',
                                    initialValue: `2-5 years? They're little kids. Won't be provided a seat.`,
                                },
                                {
                                    type: 'number',
                                    name: 'pricePerKid',
                                    placeholder: 'Enter price per kid',
                                    title: 'Price Per Kid (If Applicable)',
                                    initialValue: 0.0,
                                },
                                {
                                    type: 'number',
                                    name: 'offerPricePerKid',
                                    placeholder: 'Enter offer price per kid',
                                    title: 'Offer Price Per Kid (If Applicable)',
                                    initialValue: 0.0,
                                },
                                {
                                    type: 'number',
                                    name: 'infantAgeUpto',
                                    placeholder: 'Enter infant age upto',
                                    title: 'Infant Age Upto',
                                    initialValue: 2.0,
                                },
                                {
                                    type: 'text',
                                    name: 'infantPriceNote',
                                    placeholder: '',
                                    title: 'Infant Price Note',
                                    initialValue: `Children below 2 are infants.`,
                                },
                                {
                                    type: 'number',
                                    name: 'pricePerInfant',
                                    placeholder: 'Enter price per infant',
                                    title: 'Price Per Infant (If Applicable)',
                                    initialValue: 0.0,
                                },
                                {
                                    type: 'number',
                                    name: 'offerPricePerInfant',
                                    placeholder: 'Enter offer price per infant',
                                    title: 'Offer Price Per Infant (If Applicable)',
                                    initialValue: 0.0,
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

import React, { useMemo, useState } from 'react';

// third-party libraries
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

// application libraries
import { getAuthorized } from '../../../../../libs/auth';
import { getLocations, getTripByIdAndCategoryId } from '../../../../../apis';
import handleResponseIfError from '../../../../../utils/responseHandler';
import {
    VariantList,
    ImageList,
    getImageFormFields,
    HighlightList,
    ActivityList,
    ItineraryList,
    IncludeList,
    FaqList,
} from '../../../../v-p/trips/[tripId]/t/[type]/index';
import { GenericFormGenerator } from '../../../../../components';
import { getTripFields } from '../../../../v-p/trips/t/[type]/create';
import { getTripGeneralTypeOptions } from '../../../../../utils';
import { callPutApi } from '../../../../../libs/api';
import { showToast } from '../../../../../utils/toast';

export interface ILocation {
    id: number;
    name: string;
    city: {
        name: string;
        state: {
            name: string;
            country: {
                name: string;
            };
        };
    };
}

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Item Details | Service Management', async cookies => {
        const tripId = context.query.tripId as string;
        const categoryId = context.query.categoryId as string;

        const responseGetTrip = await getTripByIdAndCategoryId(
            tripId,
            categoryId,
            `${cookies.accessType} ${cookies.accessToken}`
        );
        const responseErrorGetTrip = handleResponseIfError(context, responseGetTrip);
        if (responseErrorGetTrip !== null) return responseErrorGetTrip;

        const responseGetLocations = await getLocations(`${cookies.accessType} ${cookies.accessToken}`);
        const responseErrorGetLocations = handleResponseIfError(context, responseGetLocations);
        if (responseErrorGetLocations !== null) return responseErrorGetLocations;

        return {
            isVendor: false,
            tripId,
            trip: responseGetTrip.data,
            categoryId: parseInt(categoryId),
            locations: responseGetLocations.data,
        };
    });

const Page = ({
    tripId,
    trip,
    categoryId,
    locations,
}: {
    tripId: string;
    trip: any;
    categoryId: number;
    locations: ILocation[];
}) => {
    const router = useRouter();
    // console.debug({ router });

    const types = {
        dateType: 'UNFIXED',
        accommodationType: 'UNFIXED',
        transportationType: 'UNFIXED',
        foodType: 'UNFIXED',
    };

    return (
        <Panel header={trip.name}>
            {useMemo(
                () =>
                    !locations || _.size(locations) === 0 ? null : (
                        <GenericFormGenerator
                            datum={{
                                ...trip,
                            }}
                            fields={getTripFields(
                                types.dateType,
                                types.accommodationType,
                                types.transportationType,
                                types.foodType,
                                '1111',
                                getTripGeneralTypeOptions,
                                locations
                            )}
                            callback={(data, resetForm) => {
                                // console.debug({ data });

                                callPutApi('/api/v1/trips/' + tripId, { ...data, categoryId }, null, null, true)
                                    .then(response => {
                                        if (!response) {
                                            showToast('Server not working!', 'error');
                                        } else if (response.statusCode !== 200) {
                                            showToast(response.message, 'error');
                                        } else {
                                            if (resetForm) resetForm();

                                            showToast(response.message, 'success');

                                            setTimeout(() => {
                                                router.reload();
                                            }, 1000);
                                        }
                                    })
                                    .catch(error => {
                                        console.error('error', error);

                                        showToast(error.message, 'error');
                                    })
                                    .finally(() => {});
                            }}
                            submitButtonText="Update Changes"
                        />
                    ),
                [
                    categoryId,
                    locations,
                    trip,
                    tripId,
                    types.accommodationType,
                    types.dateType,
                    types.foodType,
                    types.transportationType,
                ]
            )}
            <hr />
            <TabView>
                {[
                    {
                        title: 'Variants (Mandatory)',
                        component: () => VariantList(tripId),
                    },
                    {
                        title: 'Images (Mandatory)',
                        component: () => ImageList(tripId, getImageFormFields(tripId)),
                    },
                    {
                        title: 'Highlights',
                        component: () => HighlightList(tripId),
                    },
                    {
                        title: 'Activities',
                        component: () => ActivityList(tripId),
                    },
                    {
                        title: 'Itineraries',
                        component: () => ItineraryList(tripId),
                    },
                    {
                        title: 'Includes/Excludes',
                        component: () => IncludeList(tripId),
                    },
                    {
                        title: 'FAQs',
                        component: () => FaqList(tripId),
                    },
                ].map(tab => {
                    return (
                        <TabPanel key={tab.title} header={tab.title}>
                            <p className="m-0">{tab.component()}</p>
                        </TabPanel>
                    );
                })}
            </TabView>
        </Panel>
    );
};

export default Page;

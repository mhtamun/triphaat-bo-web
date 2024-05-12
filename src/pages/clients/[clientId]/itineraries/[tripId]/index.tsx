import React, { useMemo, useState } from 'react';

// third-party libraries
import { GetServerSideProps } from 'next';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

// application libraries
import { getAuthorized } from '../../../../../libs/auth';
import { getCategories, getLocations, getTripByIdAndClientId } from '../../../../../apis';
import handleResponseIfError from '../../../../../utils/responseHandler';
import { ICategory } from '../../../../../types';
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
    getAuthorized(context, 'Itinerary Details | Client Section', async cookies => {
        const tripId = context.query.tripId as string;
        const clientId = context.query.clientId as string;

        const responseGetTrip = await getTripByIdAndClientId(
            tripId,
            clientId,
            `${cookies.accessType} ${cookies.accessToken}`
        );

        const responseError = handleResponseIfError(context, responseGetTrip);
        if (responseError !== null) return responseError;

        return {
            isVendor: false,
            tripId,
            trip: responseGetTrip.data,
        };
    });

const Page = ({ tripId, trip }: { tripId: string; trip: any }) => {
    return (
        <Panel header={trip.name}>
            <TabView scrollable>
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

import React, { useCallback } from 'react';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { NextRouter } from 'next/router';

// Component for fixed package
const TabViewComponent = ({
    router,
    tripId,
    content,
}: {
    router: NextRouter;
    tripId: string;
    content: React.ReactNode;
}) => {
    const tabs = [
        { url: `/v-p/trips/${tripId}/t/${router.query.type}`, title: 'Details' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/variants`, title: 'Variants' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/images`, title: 'Images' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/videos`, title: 'Videos' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/tags`, title: 'Tags' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/highlights`, title: 'Highlights' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/activities`, title: 'Activities' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/itinerary`, title: 'Itinerary' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/includes`, title: 'Includes' },
        { url: `/v-p/trips/${tripId}/t/${router.query.type}/faqs`, title: 'Faqs' },
    ];

    const onTabChange = useCallback((e: TabViewTabChangeEvent, router: NextRouter, tripId: string) => {
        router.push(tabs[e.index].url);
    }, []);

    // console.debug({ router });

    const activeIndex = tabs.findIndex(
        tab => router.asPath === tab.url || router.asPath.includes(tab.title.toLowerCase())
    );

    return (
        <TabView activeIndex={activeIndex} onTabChange={e => onTabChange(e, router, tripId)}>
            {tabs.map((tab, index) => (
                <TabPanel key={index} header={tab.title}>
                    {router.asPath !== tab.url && !router.asPath.includes(tab.title.toLowerCase()) ? null : content}
                </TabPanel>
            ))}
        </TabView>
    );
};

export default TabViewComponent;

import React, { useCallback } from 'react';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { NextRouter } from 'next/router';

const TabViewComponent = ({
    activeIndex = 0,
    router,
    tripId,
    content,
}: {
    activeIndex: number;
    router: NextRouter;
    tripId: string;
    content: React.ReactNode;
}) => {
    const onTabChange = useCallback((e: TabViewTabChangeEvent, router: NextRouter, tripId: string) => {
        if (e.index === 0) router.push(`/v-p/trips/${tripId}`);
        if (e.index === 1) router.push(`/v-p/trips/${tripId}/variants`);
        if (e.index === 2) router.push(`/v-p/trips/${tripId}/images`);
        if (e.index === 3) router.push(`/v-p/trips/${tripId}/videos`);
        if (e.index === 4) router.push(`/v-p/trips/${tripId}/tags`);
        if (e.index === 5) router.push(`/v-p/trips/${tripId}/highlights`);
        if (e.index === 6) router.push(`/v-p/trips/${tripId}/includes`);
        if (e.index === 7) router.push(`/v-p/trips/${tripId}/faqs`);
        if (e.index === 8) router.push(`/v-p/trips/${tripId}/travelers`);
        if (e.index === 9) router.push(`/v-p/trips/${tripId}/payments`);
    }, []);

    return (
        <TabView activeIndex={activeIndex} onTabChange={e => onTabChange(e, router, tripId)}>
            <TabPanel header="Details">{activeIndex === 0 ? content : null}</TabPanel>
            <TabPanel header="Variants">{activeIndex === 1 ? content : null}</TabPanel>
            <TabPanel header="Images">{activeIndex === 2 ? content : null}</TabPanel>
            <TabPanel header="Videos">{activeIndex === 3 ? content : null}</TabPanel>
            <TabPanel header="Tags">{activeIndex === 4 ? content : null}</TabPanel>
            <TabPanel header="Highlights">{activeIndex === 5 ? content : null}</TabPanel>
            <TabPanel header="Includes">{activeIndex === 6 ? content : null}</TabPanel>
            <TabPanel header="FAQs">{activeIndex === 7 ? content : null}</TabPanel>
            <TabPanel header="Travelers">{activeIndex === 8 ? content : null}</TabPanel>
            <TabPanel header="Payments">{activeIndex === 9 ? content : null}</TabPanel>
        </TabView>
    );
};

export default TabViewComponent;

import React, { useCallback } from 'react';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { Menubar } from 'primereact/menubar';
import { MenuItemCommandEvent } from 'primereact/menuitem';
import { NextRouter } from 'next/router';

// Component for fixed package
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
    const items = [
        {
            label: 'Booking',
            icon: 'pi pi-fw pi-book',
            items: [
                {
                    label: 'Create New',
                    icon: 'pi pi-fw pi-plus',
                    command: (e: MenuItemCommandEvent) => {
                        e.originalEvent.preventDefault();

                        router.push('/v-p/fixed-package-trips/' + tripId + '/booking');
                    },
                },
                {
                    label: 'List',
                    icon: 'pi pi-fw pi-align-justify',
                    command: (e: MenuItemCommandEvent) => {
                        e.originalEvent.preventDefault();
                    },
                },
            ],
        },
        {
            label: 'Expenses',
            icon: 'pi pi-fw pi-money-bill',
            items: [
                {
                    label: 'Create New',
                    icon: 'pi pi-fw pi-plus',
                    command: (e: MenuItemCommandEvent) => {
                        e.originalEvent.preventDefault();
                    },
                },
                {
                    label: 'Expense List',
                    icon: 'pi pi-fw pi-align-justify',
                    command: (e: MenuItemCommandEvent) => {
                        e.originalEvent.preventDefault();
                    },
                },
                {
                    separator: true,
                },
                {
                    label: 'Balance',
                    icon: 'pi pi-fw pi-calculator',
                    command: (e: MenuItemCommandEvent) => {
                        e.originalEvent.preventDefault();
                    },
                },
            ],
        },
        {
            label: 'Copy This Trip',
            icon: 'pi pi-fw pi-copy',
        },
        {
            label: 'Deactivate This Trip',
            icon: 'pi pi-fw pi-ban',
        },
    ];

    const onTabChange = useCallback((e: TabViewTabChangeEvent, router: NextRouter, tripId: string) => {
        if (e.index === 0) router.push(`/v-p/fixed-package-trips/${tripId}`);
        if (e.index === 1) router.push(`/v-p/fixed-package-trips/${tripId}/variants`);
        if (e.index === 2) router.push(`/v-p/fixed-package-trips/${tripId}/images`);
        if (e.index === 3) router.push(`/v-p/fixed-package-trips/${tripId}/videos`);
        if (e.index === 4) router.push(`/v-p/fixed-package-trips/${tripId}/tags`);
        if (e.index === 5) router.push(`/v-p/fixed-package-trips/${tripId}/highlights`);
        if (e.index === 6) router.push(`/v-p/fixed-package-trips/${tripId}/activities`);
        if (e.index === 7) router.push(`/v-p/fixed-package-trips/${tripId}/itinerary`);
        if (e.index === 8) router.push(`/v-p/fixed-package-trips/${tripId}/includes`);
        if (e.index === 9) router.push(`/v-p/fixed-package-trips/${tripId}/faqs`);
    }, []);

    return (
        <>
            <Menubar model={items} className="mb-3" />
            <TabView activeIndex={activeIndex} onTabChange={e => onTabChange(e, router, tripId)}>
                <TabPanel header="Details">{activeIndex === 0 ? content : null}</TabPanel>
                <TabPanel header="Variants">{activeIndex === 1 ? content : null}</TabPanel>
                <TabPanel header="Images">{activeIndex === 2 ? content : null}</TabPanel>
                <TabPanel header="Videos">{activeIndex === 3 ? content : null}</TabPanel>
                <TabPanel header="Tags">{activeIndex === 4 ? content : null}</TabPanel>
                <TabPanel header="Highlights">{activeIndex === 5 ? content : null}</TabPanel>
                <TabPanel header="Activities">{activeIndex === 6 ? content : null}</TabPanel>
                <TabPanel header="Itinerary">{activeIndex === 7 ? content : null}</TabPanel>
                <TabPanel header="Includes">{activeIndex === 8 ? content : null}</TabPanel>
                <TabPanel header="FAQs">{activeIndex === 9 ? content : null}</TabPanel>
            </TabView>
        </>
    );
};

export default TabViewComponent;

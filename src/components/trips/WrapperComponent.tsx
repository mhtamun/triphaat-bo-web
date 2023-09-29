import React from 'react';
import { Panel } from 'primereact/panel';
import { Menubar } from 'primereact/menubar';
import { MenuItemCommandEvent } from 'primereact/menuitem';
import { NextRouter } from 'next/router';

// Component for fixed package
const WrapperComponent = ({
    title,
    tripId,
    router,
    children,
}: {
    title: string;
    tripId?: string | null;
    router?: NextRouter | null;
    children: React.ReactNode;
}) => {
    return (
        <Panel header={title}>
            {!tripId || !router ? null : (
                <Menubar
                    model={[
                        {
                            label: 'Back',
                            icon: 'pi pi-fw pi-arrow-left',
                            command: (e: MenuItemCommandEvent) => {
                                e.originalEvent.preventDefault();

                                router.back();
                            },
                        },
                        {
                            label: 'Booking',
                            icon: 'pi pi-fw pi-book',
                            items: [
                                {
                                    label: 'Create New',
                                    icon: 'pi pi-fw pi-plus',
                                    command: (e: MenuItemCommandEvent) => {
                                        e.originalEvent.preventDefault();

                                        router.push('/v-p/fixed-package-trips/' + tripId + '/bookings/create');
                                    },
                                },
                                {
                                    label: 'List',
                                    icon: 'pi pi-fw pi-align-justify',
                                    command: (e: MenuItemCommandEvent) => {
                                        e.originalEvent.preventDefault();

                                        router.push('/v-p/fixed-package-trips/' + tripId + '/bookings');
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
                    ]}
                    className="mb-3"
                />
            )}
            {children}
        </Panel>
    );
};

export default WrapperComponent;

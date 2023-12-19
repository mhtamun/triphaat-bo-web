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
    copyTripCallBack,
    deactivateTripCallBack,
}: {
    title: string;
    tripId?: string | null;
    router?: NextRouter | null;
    children: React.ReactNode;
    copyTripCallBack?: () => void;
    deactivateTripCallBack?: () => void;
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
                            label: 'Service Date Setup',
                            icon: 'pi pi-fw pi-calendar',
                            command: (e: MenuItemCommandEvent) => {
                                e.originalEvent.preventDefault();

                                router.push('/v-p/trips/' + tripId + '/t/' + router.query.type + '/service-dates');
                            },
                        },

                        {
                            label: 'Room Seat Setup',
                            icon: 'pi pi-fw pi-building',
                            command: (e: MenuItemCommandEvent) => {
                                e.originalEvent.preventDefault();

                                router.push('/v-p/trips/' + tripId + '/t/' + router.query.type + '/room-seats');
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

                                        router.push(
                                            '/v-p/trips/' + tripId + '/t/' + router.query.type + '/bookings/create'
                                        );
                                    },
                                },
                                {
                                    label: 'List',
                                    icon: 'pi pi-fw pi-align-justify',
                                    command: (e: MenuItemCommandEvent) => {
                                        e.originalEvent.preventDefault();

                                        router.push('/v-p/trips/' + tripId + '/t/' + router.query.type + '/bookings');
                                    },
                                },
                            ],
                        },
                        // {
                        //     label: 'Expenses',
                        //     icon: 'pi pi-fw pi-money-bill',
                        //     items: [
                        //         {
                        //             label: 'Create New',
                        //             icon: 'pi pi-fw pi-plus',
                        //             command: (e: MenuItemCommandEvent) => {
                        //                 e.originalEvent.preventDefault();
                        //             },
                        //         },
                        //         {
                        //             label: 'Expense List',
                        //             icon: 'pi pi-fw pi-align-justify',
                        //             command: (e: MenuItemCommandEvent) => {
                        //                 e.originalEvent.preventDefault();
                        //             },
                        //         },
                        //         {
                        //             separator: true,
                        //         },
                        //         {
                        //             label: 'Balance',
                        //             icon: 'pi pi-fw pi-calculator',
                        //             command: (e: MenuItemCommandEvent) => {
                        //                 e.originalEvent.preventDefault();
                        //             },
                        //         },
                        //     ],
                        // },
                        {
                            label: 'Copy This Trip',
                            icon: 'pi pi-fw pi-copy',
                            command: (e: MenuItemCommandEvent) => {
                                e.originalEvent.preventDefault();

                                if (tripId && copyTripCallBack) copyTripCallBack();
                            },
                        },
                        {
                            label: 'Deactivate This Trip',
                            icon: 'pi pi-fw pi-ban',
                            command: (e: MenuItemCommandEvent) => {
                                e.originalEvent.preventDefault();

                                if (tripId && deactivateTripCallBack) deactivateTripCallBack();
                            },
                        },
                    ].filter(item => {
                        if (router.query.type === '0000' && item.label === 'Service Date Setup') return false;

                        if (router.query.type === '0000' && item.label === 'Room Seat Setup') return false;

                        if (router.query.type === '1100' && item.label === 'Expenses') return false;

                        if (router.query.type === '1100' && item.label === 'Copy This Trip') return false;

                        return true;
                    })}
                    className="mb-3"
                />
            )}
            {children}
        </Panel>
    );
};

export default WrapperComponent;

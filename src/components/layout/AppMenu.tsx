/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../../types/types';

const AppMenu = ({ isVendor }: { isVendor?: boolean }) => {
    let model: AppMenuItem[] = [];

    const triphaatAdminMenuModel = [
        {
            label: 'Home',
            items: [{ icon: 'pi pi-fw pi-home', label: 'Dashboard', to: '/' }],
        },
        {
            label: 'Menu',
            items: [
                {
                    icon: 'pi pi-fw pi-user',
                    label: 'User Management',
                    items: [
                        {
                            label: 'Roles',
                            to: '/roles',
                        },
                        {
                            label: 'Users',
                            to: '/users',
                        },
                    ],
                },
                {
                    icon: 'pi pi-fw pi-file',
                    label: 'File Management',
                    to: '/folders',
                },
                {
                    icon: 'pi pi-fw pi-building',
                    label: 'Vendor Management',
                    to: '/vendors',
                },
                {
                    icon: 'pi pi-fw pi-map',
                    label: 'Location Management',
                    items: [
                        {
                            label: 'Countries',
                            to: '/locations/countries',
                        },
                        {
                            label: 'Locations',
                            to: '/locations',
                        },
                    ],
                },
                {
                    icon: 'pi pi-fw pi-list',
                    label: 'Slider Management',
                    to: '/sliders',
                },
                {
                    icon: 'pi pi-fw pi-list',
                    label: 'Item Management',
                    items: [
                        {
                            icon: 'pi pi-fw pi-th-large',
                            label: 'Categories',
                            to: '/categories',
                        },
                    ],
                },
                {
                    icon: 'pi pi-fw pi-list',
                    label: 'Itinerary Management',
                    items: [
                        {
                            icon: 'pi pi-fw pi-users',
                            label: 'Clients',
                            to: '/clients',
                        },
                    ],
                },
                {
                    icon: 'pi pi-fw pi-star',
                    label: 'Featured on Website',
                    items: [
                        {
                            label: 'Featured Navigation Item Management',
                            to: '/featured-nav-items',
                        },
                        {
                            label: 'Featured Service Management',
                            to: '/featured-services',
                        },
                        // {
                        //     label: 'Featured Country Management',
                        //     to: '/featured-countries',
                        // },
                        // {
                        //     label: 'Featured City Management',
                        //     to: '/featured-cities',
                        // },
                        {
                            label: 'Featured Categorized Item Management',
                            to: '/featured-categorized-items',
                        },
                        {
                            label: 'Featured Location Management',
                            to: '/featured-locations',
                        },
                        // {
                        //     label: 'Featured Trip Management',
                        //     to: '/featured-trips',
                        // },
                    ],
                },
                {
                    icon: 'pi pi-fw pi-book',
                    label: 'Blog Management',
                    items: [
                        {
                            label: 'Blog Topics',
                            to: '/blogs/topics',
                        },
                        {
                            label: 'Blog Tags',
                            to: '/blogs/tags',
                        },
                        {
                            label: 'Blogs',
                            to: '/blogs',
                        },
                    ],
                },
                {
                    icon: 'pi pi-fw pi-list',
                    label: 'Contacts',
                    to: '/contacts',
                },
            ],
        },
    ];

    const vendorAdminMenuModel = [
        {
            label: 'Home',
            items: [{ icon: 'pi pi-fw pi-home', label: 'Dashboard', to: '/v-p' }],
        },
        {
            label: 'Administration',
            items: [
                { icon: 'pi pi-fw pi pi-user', label: 'Vendor Profile', to: '/v-p/profile' },
                { icon: 'pi pi-fw pi-users', label: 'User Management', to: '/v-p/users' },
            ],
        },
        {
            label: 'Accounts',
            items: [
                {
                    icon: 'pi pi-fw pi-money-bill',
                    label: 'Expenses',
                    to: '/v-p/accounting/expenses',
                },
                {
                    icon: 'pi pi-fw pi-money-bill',
                    label: 'Revenues',
                    to: '/v-p/accounting/revenues',
                },
                {
                    icon: 'pi pi-fw pi-money-bill',
                    label: 'Statement',
                    to: '/v-p/accounting/statement',
                },
            ],
        },
        {
            label: 'Trips',
            items: [
                { icon: 'pi pi-bars', label: 'Group Tours', to: '/v-p/trips/t/0000' },
                { icon: 'pi pi-bars', label: 'Houseboats', to: '/v-p/trips/t/2260' },
            ],
        },
    ];

    if (!isVendor) {
        model = triphaatAdminMenuModel;
    } else {
        model = vendorAdminMenuModel;
    }

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;

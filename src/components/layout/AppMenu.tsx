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
                    icon: 'pi pi-fw pi-th-large',
                    label: 'Vendor Management',
                    to: '/vendors',
                },
                {
                    icon: 'pi pi-fw pi-map',
                    label: 'Location Management',
                    to: '/locations/countries',
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
                { icon: 'pi pi-fw pi pi-user', label: 'Profile', to: '/v-p/profile' },
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
                { icon: 'pi pi-bars', label: 'Fixed Package Trips', to: '/v-p/trips/type/0000/list' },
                { icon: 'pi pi-bars', label: 'Full-Board Package Trips', to: '' },
            ],
        },
    ];

    // const userType = JSON.parse(getCookie('user')).type;
    // console.debug({ userType });

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

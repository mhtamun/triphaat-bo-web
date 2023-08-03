/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../../types/types';

const AppMenu = ({ isVendor }: { isVendor?: boolean }) => {
    let model: AppMenuItem[] = [];

    const triphaatAdminMenuModel = [
        {
            label: 'Menu',
            items: [
                { icon: 'pi pi-fw pi-home', label: 'Dashboard', to: '/' },
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
                    icon: 'pi pi-fw pi-th-large',
                    label: 'Vendor Management',
                    to: '/vendors',
                },
                {
                    icon: 'pi pi-fw pi-image',
                    label: 'Trip Management',
                    items: [
                        {
                            label: 'Locations',
                            to: '/trips/locations',
                        },
                        {
                            label: 'Trips',
                            to: '/trips',
                        },
                    ],
                },
            ],
        },
    ];

    const vendorAdminMenuModel = [
        {
            label: 'Menu',
            items: [
                { icon: 'pi pi-fw pi-home', label: 'Dashboard', to: '/' },
                { icon: 'pi pi-fw pi-user', label: 'User Management', to: '/v/users' },
                { icon: 'pi pi-fw pi-image', label: 'Trip Management', to: '/v/trips' },
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

import React from 'react';

// third-party
import { BreadCrumb } from 'primereact/breadcrumb';
import { NextRouter } from 'next/router';
// import { MenuItem, MenuItemOptions } from 'primereact/menuitem';
import * as _ from 'lodash';

const BreadCrumbComponent = ({
    router,
    replaceItems,
}: {
    router: NextRouter;
    replaceItems?: { identifier: string; replaceWith: string }[];
}) => {
    // console.debug({ router });

    // const iconItemTemplate = (item: MenuItem, options: MenuItemOptions) => {
    //     return (
    //         <a className={options.className}>
    //             <span className={item.label}></span>
    //         </a>
    //     );
    // };

    const items = _.map(
        _.filter(_.split(router.pathname, '/'), path => path !== '' && path !== 'v-p'),
        path => ({
            label: _.upperFirst(path),
            command: () => {
                router.push('/' + path);
            },
        })
    );

    const home = { icon: 'pi pi-home', url: '' };

    return <BreadCrumb className="mb-3" model={items} home={home} />;
};

export default BreadCrumbComponent;

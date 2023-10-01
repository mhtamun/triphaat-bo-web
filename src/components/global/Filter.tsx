import React, { useCallback } from 'react';
import { NextRouter } from 'next/router';
import { Panel } from 'primereact/panel';
import _ from 'lodash';
import GenericFormGenerator, { IField } from './GenericFormGenerator';
import { generateQueryPath } from '../../utils';

const FilterComponent = ({
    fields,
    router,
    pathParams,
}: {
    fields: IField[];
    router: NextRouter;
    pathParams?: any | {} | null;
}) => {
    // console.debug({ pathname: router.pathname, url: router.route });
    // console.debug({ router });

    const replaceHistory = useCallback((values: any | null) => {
        // console.debug({ values });

        if (!values || _.isEmpty(values)) {
            const path = generateQueryPath(router.pathname, pathParams);
            // console.debug({ path });

            router.replace(path);
        } else {
            const path = generateQueryPath(router.pathname, pathParams, { ...values, skip: 0, take: 10 });
            // console.debug({ path });

            router.replace(path);
        }
    }, []);

    return (
        <Panel header="Filter">
            <GenericFormGenerator
                fields={fields}
                callback={values => {
                    // console.debug({ values });

                    replaceHistory(values);
                }}
                submitButtonShow={true}
                submitButtonText="Submit Filter"
                resetButtonShow={true}
                resetButtonText="Reset Filter"
                enableReinitialize={false}
            />
        </Panel>
    );
};

export default FilterComponent;

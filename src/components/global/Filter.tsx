import React, { useCallback } from 'react';
import { NextRouter } from 'next/router';
import { Panel } from 'primereact/panel';
import _ from 'lodash';
import GenericFormGenerator, { IField } from './GenericFormGenerator';
import { generateQueryPath } from '../../utils';

const FilterComponent = ({
    fields,
    router,
    ignorePathParams,
}: {
    fields: IField[];
    router: NextRouter;
    ignorePathParams?: string[];
}) => {
    // console.debug({ pathname: router.pathname, url: router.route });
    // console.debug({ router });

    const replaceHistory = useCallback((values: any | null) => {
        // console.debug({ values });

        if (!values || _.isEmpty(values)) {
            router.replace(router.asPath.split('?')[0]);
        } else {
            const path = `${router.asPath.split('?')[0]}${generateQueryPath(
                { ...values, skip: 0, take: 10 },
                ignorePathParams
            )}`;

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

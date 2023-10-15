import React, { useCallback } from 'react';
import { NextRouter } from 'next/router';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GenericFormGenerator, { IField } from './GenericFormGenerator';
import { generateQueryPath } from '../../utils';
import _ from 'lodash';

const FilterComponent = ({
    fields,
    router,
    pathParams,
}: {
    fields: IField[];
    router: NextRouter;
    pathParams?: any | null;
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
        <Accordion>
            <AccordionTab
                header={
                    <div className="flex align-items-center">
                        <FontAwesomeIcon icon={faFilter} className="mr-2" />
                        <span className="vertical-align-middle">Filter</span>
                    </div>
                }
            >
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
            </AccordionTab>
        </Accordion>
    );
};

export default FilterComponent;

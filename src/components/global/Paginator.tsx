import React from 'react';
import { NextRouter } from 'next/router';
import { Paginator } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import { generateQueryPath } from '../../utils';

const PaginatorComponent = ({
    router,
    pathParams,
    totalRecords = 10000,
}: {
    router: NextRouter;
    pathParams?: any | null;
    totalRecords?: number;
}) => {
    const skip = !router.query.skip ? 0 : parseInt(router.query.skip as string);
    const take = !router.query.take ? 10 : parseInt(router.query.take as string);
    const page = skip / take + 1;

    // console.debug({ skip, take, page });

    const template2 = {
        layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
        RowsPerPageDropdown: (options: any) => {
            const dropdownOptions = [
                { label: 10, value: 10 },
                { label: 50, value: 50 },
                { label: 100, value: 100 },
            ];

            return (
                <React.Fragment>
                    <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                        Items per page:{' '}
                    </span>
                    <Dropdown value={take} options={dropdownOptions} onChange={options.onChange} />
                </React.Fragment>
            );
        },
        CurrentPageReport: (options: any) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '9rem', textAlign: 'right' }}>
                    Page number: <strong>{page}</strong>
                </span>
            );
        },
    };

    return (
        <Paginator
            className="justify-content-end"
            template={template2}
            first={skip}
            rows={take}
            totalRecords={totalRecords}
            onPageChange={event => {
                // console.debug({ event });

                const path = generateQueryPath(router.pathname, pathParams, {
                    ...router.query,
                    skip: event.first,
                    take: event.rows,
                });
                // console.debug({ path });

                router.replace(path);
            }}
        />
    );
};

export default PaginatorComponent;

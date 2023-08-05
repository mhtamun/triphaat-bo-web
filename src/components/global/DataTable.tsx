import React from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable as Table } from 'primereact/datatable';
import _ from 'lodash';

export interface IAction {
    text?: string;
    icon: string;
    color: 'success' | 'warning' | 'info' | 'danger' | 'secondary' | 'help';
    callback: (identifier: string | number) => void;
}

const DataTable = ({
    data,
    ignoredColumns,
    actionIdentifier = 'id',
    actions = [],
    emptyListText = null,
}: {
    data: any;
    ignoredColumns?: string[];
    actionIdentifier?: string;
    actions: IAction[];
    emptyListText?: string | null;
}) => {
    const columnHeads = [];

    if (!_.isUndefined(data) && !_.isNull(data) && _.size(data) > 0) {
        _.map(_.keys(_.omit(data[0], [...(ignoredColumns ?? [])])), key => {
            columnHeads.push({
                key,
                label: _.upperCase(key),
                headerStyle: { minWidth: '10rem' },
            });
        });

        if (!_.isNull(actions) && _.size(actions) > 0) {
            columnHeads.push({
                key: 'actions',
                label: 'ACTIONS',
                headerStyle: { minWidth: '10rem' },
            });
        }
    }

    let mappedData = data;

    // console.debug({ actions });

    if (_.size(actions) > 0) {
        mappedData = _.map(data, datum => ({
            ...datum,
            actions: (
                <>
                    {_.map(actions, (action: IAction, index: number) => (
                        <Button
                            label={action.text ?? undefined}
                            icon={action.icon}
                            severity={action.color}
                            className={index !== 0 ? 'ml-2' : ''}
                            rounded={!action.text}
                            onClick={e => {
                                e.preventDefault();

                                action.callback(datum[actionIdentifier]);
                            }}
                        />
                    ))}
                </>
            ),
        }));
    }

    // console.debug({ mappedData });

    const dummyHeaderFooterForEmptyDataset =
        !_.isUndefined(data) && !_.isNull(data) && _.size(data) > 0 ? undefined : ' ';

    const emptyMessageStyle = { color: 'red' };

    return (
        <Table
            value={mappedData}
            emptyMessage={
                emptyListText ?? (
                    <>
                        <h2 style={emptyMessageStyle}>Oops!</h2>
                        <p style={emptyMessageStyle}>No data available!!</p>
                    </>
                )
            }
            header={dummyHeaderFooterForEmptyDataset}
            footer={dummyHeaderFooterForEmptyDataset}
            columnResizeMode="expand"
            resizableColumns
            showGridlines
            scrollable
        >
            {_.map(columnHeads, item => {
                return (
                    <Column
                        key={item.key}
                        field={item.key}
                        header={item.label}
                        sortable={!_.isEqual(item.key, 'actions')}
                        headerStyle={item.headerStyle}
                    ></Column>
                );
            })}
        </Table>
    );
};

export default DataTable;

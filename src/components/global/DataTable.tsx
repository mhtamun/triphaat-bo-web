import React from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable as Table } from 'primereact/datatable';
import { faLightbulb, faComputerMouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

export interface IAction {
    text?: string;
    icon: string;
    color: 'success' | 'warning' | 'info' | 'danger' | 'secondary' | 'help';
    tooltip?: string;
    callback: (identifier: string | number) => void;
}

const DataTable = ({
    data,
    ignoredColumns,
    scopedColumns,
    actionIdentifier = 'id',
    actions = [],
    emptyListText = null,
}: {
    data: any;
    ignoredColumns?: string[];
    scopedColumns?: any;
    actionIdentifier?: string;
    actions: IAction[];
    emptyListText?: string | null;
}) => {
    const columnHeads = [];

    if (!_.isUndefined(data) && !_.isNull(data) && _.size(data) > 0) {
        _.map(_.keys(_.omit(data[0], [...(ignoredColumns ?? [])])), (key: string) => {
            columnHeads.push({
                key,
                label: _.upperCase(key),
                headerStyle: { minWidth: '10rem' },
                frozen: false,
                body: !scopedColumns ? undefined : scopedColumns[key],
            });
        });

        if (!_.isNull(actions) && _.size(actions) > 0) {
            columnHeads.push({
                key: 'actions',
                label: 'ACTIONS',
                headerStyle: { minWidth: 'auto' },
                style: { width: 'auto' },
                frozen: true,
                body: undefined,
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
                            key={index}
                            label={action.text ?? undefined}
                            icon={action.icon}
                            severity={action.color}
                            className={index !== 0 ? 'ml-2' : ''}
                            rounded={!action.text}
                            onClick={e => {
                                e.preventDefault();

                                // console.debug({ datumIdentifier: datum[actionIdentifier] });
                                action.callback(datum[actionIdentifier]);
                            }}
                            tooltip={action.tooltip}
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 20 }}
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
            footer={
                <p style={{ color: 'orangered' }}>
                    <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                    {`"Did you know? You can scroll horizontally by holding down the Shift key and using your mouse scroll wheel. Try it out to navigate wide web pages or spreadsheets more easily!" - Rafi Hasnain`}
                    <FontAwesomeIcon icon={faComputerMouse} className="ml-2" />
                </p>
            }
            columnResizeMode="expand"
            resizableColumns
            showGridlines
            scrollable={true}
            scrollHeight="100vh"
        >
            {_.map(columnHeads, item => {
                return (
                    <Column
                        key={item.key}
                        field={item.key}
                        header={item.label}
                        sortable={!_.isEqual(item.key, 'actions')}
                        headerStyle={item.headerStyle}
                        frozen={item.frozen}
                        alignFrozen="right"
                        body={item.body}
                    ></Column>
                );
            })}
        </Table>
    );
};

export default DataTable;

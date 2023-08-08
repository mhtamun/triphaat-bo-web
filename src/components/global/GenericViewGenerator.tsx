import React, { useEffect, useState, useMemo } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { DataTable, ModalConfirmation, Modal, GenericFormGenerator } from '../index';
import { callGetApi, callDeleteApi, callPutApi, callPostApi } from '../../libs/api';
import _ from 'lodash';
import { IAction } from './DataTable';
import { IField } from './GenericFormGenerator';

const DeleteItemComponent = ({
    isConfirmationModalOpen,
    setConfirmationModalOpen,
    deleteApiUri,
    deleteIdentifier,
    datumId,
    onSuccess,
}: {
    isConfirmationModalOpen: boolean;
    setConfirmationModalOpen: (isConfirmationModalOpen: boolean) => void;
    deleteApiUri: string;
    deleteIdentifier: string;
    datumId: string;
    onSuccess: () => void;
}) => {
    return (
        <ModalConfirmation
            isOpen={isConfirmationModalOpen}
            onCancel={() => {
                setConfirmationModalOpen(!isConfirmationModalOpen);
            }}
            title="Are you sure you want to delete this entry?"
            subtitle="You cannot undo this operation."
            cancelCallback={() => {
                setConfirmationModalOpen(!isConfirmationModalOpen);
            }}
            confirmCallback={() => {
                setConfirmationModalOpen(!isConfirmationModalOpen);
                callDeleteApi(_.replace(deleteApiUri, deleteIdentifier, datumId))
                    .then(response => {
                        if (!response) {
                            // todo
                        } else if (response.statusCode !== 200) {
                            // todo
                        } else {
                            onSuccess();
                        }
                    })
                    .catch(error => {
                        console.error('error', error);
                    });
            }}
        />
    );
};

const EditItemComponent = ({
    isFormModalOpen,
    setFormModalOpen,
    putApiUri,
    putIdentifier,
    datumId,
    datum,
    fields,
    nonEdibleFields = [],
    onSuccess,
    name,
}: {
    isFormModalOpen: boolean;
    setFormModalOpen: (value: boolean) => void;
    fields: any;
    nonEdibleFields?: string[];
    putApiUri: string;
    putIdentifier: string;
    datumId: any;
    datum: any;
    onSuccess: (data: any) => void;
    name: string;
}) => {
    return (
        <Modal
            visible={isFormModalOpen}
            header={`Update ${_.lowerCase(name)}`}
            onHide={() => {
                setFormModalOpen(false);
            }}
        >
            <GenericFormGenerator
                datum={datum}
                fields={fields}
                nonEdibleFields={nonEdibleFields}
                callback={(data, callback) => {
                    // console.debug({ data });

                    callPutApi(_.replace(putApiUri, putIdentifier, datumId), data, null, null, true)
                        .then(response => {
                            if (!response) {
                                // todo
                            } else if (response.statusCode !== 200) {
                                // todo
                            } else {
                                callback();

                                setFormModalOpen(false);

                                onSuccess(data);
                            }
                        })
                        .catch(error => {
                            console.error('error', error);
                        })
                        .finally(() => {});
                }}
            />
        </Modal>
    );
};

const AddNewItemComponent = ({
    isFormModalOpen,
    setFormModalOpen,
    fields,
    nonEdibleFields,
    postApiUri,
    onSuccess,
    name,
}: {
    isFormModalOpen: boolean;
    setFormModalOpen: (value: boolean) => void;
    fields: any;
    nonEdibleFields?: string[];
    postApiUri: string;
    onSuccess: (data: any) => void;
    name: string;
}) => {
    return (
        <Modal
            visible={isFormModalOpen}
            header={`Create new ${_.lowerCase(name)}`}
            onHide={() => {
                setFormModalOpen(false);
            }}
        >
            <GenericFormGenerator
                fields={fields}
                nonEdibleFields={nonEdibleFields}
                callback={(data, resetForm) => {
                    // console.debug({ data });

                    callPostApi(postApiUri, data)
                        .then(response => {
                            if (!response) {
                                // todo
                            } else if (response.statusCode !== 200) {
                                // todo
                            } else {
                                resetForm();

                                setFormModalOpen(false);

                                onSuccess(data);
                            }
                        })
                        .catch(error => {
                            console.error('error', error);
                        })
                        .finally(() => {});
                }}
            />
        </Modal>
    );
};

function GenericViewGenerator({
    name,
    title,
    subtitle,
    viewAll,
    addNew,
    viewOne,
    editExisting,
    removeOne,
    fields,
    editFields,
    nonEdibleFields,
    customActions,
    filtration = null,
    pagination = null,
}: {
    name: string;
    title?: string;
    subtitle?: string;
    viewAll: {
        uri: string;
        ignoredColumns?: string[];
        actionIdentifier?: string;
        actionDatum?: any;
        onDataModify?: (data: any) => any;
        onSuccess?: (data: any) => void;
    };
    addNew?: {
        uri: string;
        callback?: (data: any) => any;
        buttonText?: string;
    };
    viewOne?: {
        uri: string;
        identifier: string;
        onDataModify?: (data: any) => any;
        onSuccess?: (data: any) => void;
    };
    editExisting?: { uri: string; identifier: string; callback?: (data: any) => any };
    removeOne?: { uri: string; identifier: string; callback?: () => any };
    fields?: IField[];
    editFields?: IField[];
    nonEdibleFields?: string[];
    customActions?: IAction[];
    filtration?: any;
    pagination?: any;
}) {
    // Props
    const {
        uri: getAllApiUri,
        ignoredColumns,
        actionIdentifier,
        actionDatum = null,
        onDataModify: getAllDataModificationCallback,
        onSuccess: getAllSuccessCallback = null,
    } = viewAll;
    const { uri: postApiUri, callback: addNewCallback, buttonText: addNewItemButtonText } = addNew || {};
    const {
        uri: getOneApiUri,
        identifier: getOneIdentifier,
        onDataModify: getOneDataModificationCallback,
        onSuccess: getOneSuccessCallback,
    } = viewOne || {};
    const { uri: putApiUri, identifier: putIdentifier, callback: editExistingCallback } = editExisting || {};
    const { uri: deleteApiUri, identifier: deleteIdentifier, callback: removeOneCallback } = removeOne || {};
    // Props
    // States
    const [data, setData] = useState<any>(null);
    const [datum, setDatum] = useState<any>(null);
    const [datumId, setDatumId] = useState<any>(null);
    const [isAddFormModalOpen, setAddFormModalOpen] = useState<boolean>(false);
    const [isEditFormModalOpen, setEditFormModalOpen] = useState<boolean>(false);
    const [isDeleteFormModalOpen, setDeleteFormModalOpen] = useState<boolean>(false);
    const [actions, setActions] = useState<IAction[]>(customActions ?? []);
    // States

    // console.debug({
    //     isAddFormModalOpen,
    // });

    const getAllData = (getApiUri: string, handleDataCallback?: (data: any) => any) => {
        callGetApi(getApiUri, null, true)
            .then(response => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                const tempData = !handleDataCallback ? response.data : handleDataCallback(response.data);

                setData(tempData);

                if (!_.isUndefined(getAllSuccessCallback) && !_.isNull(getAllSuccessCallback))
                    getAllSuccessCallback(response.data);
            })
            .catch(error => {
                console.error('error', error);
            });
    };

    const getDatum = (
        getOneApiUri: string,
        getOneIdentifier: string,
        value: string,
        handleDataCallback?: (data: any) => any
    ) => {
        callGetApi(_.replace(getOneApiUri, getOneIdentifier, value), null, true)
            .then(response => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                setDatum(!handleDataCallback ? response.data : handleDataCallback(response.data));

                if (!_.isUndefined(getOneSuccessCallback) && !_.isNull(getOneSuccessCallback))
                    getOneSuccessCallback(response.data);
            })
            .catch(error => {
                console.error('error', error);
            });
    };

    useEffect(() => {
        const tempActions: IAction[] = [...actions];

        if (actionIdentifier && getOneApiUri && getOneIdentifier && putApiUri && putIdentifier) {
            tempActions.push({
                text: 'Edit',
                icon: 'pi pi-pencil',
                color: 'warning',
                callback: id => {
                    // console.debug({ id });

                    getDatum(getOneApiUri, getOneIdentifier, id.toString(), getOneDataModificationCallback);
                },
            });
        }

        if (actionIdentifier && deleteApiUri && deleteIdentifier)
            tempActions.push({
                text: 'Delete',
                icon: 'pi pi-trash',
                color: 'danger',
                callback: id => {
                    // console.debug({ id });

                    setDatumId(id);
                    setDeleteFormModalOpen(true);
                },
            });

        // console.debug({ tempActions });

        setActions(tempActions);
    }, []);

    useEffect(() => {
        getAllData(getAllApiUri, getAllDataModificationCallback);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAllApiUri]);

    useEffect(() => {
        if (!_.isUndefined(actionDatum) && !_.isNull(actionDatum) && !_.isNull(data) && _.size(data) > 0) {
            const tempData = [...data];
            const actionChangeIndex = _.findIndex(data, (element: any) => element.id === actionDatum.id);
            if (actionChangeIndex !== -1) tempData.splice(actionChangeIndex, 1, actionDatum);

            // console.debug({ actionDatum, data, tempData });

            setData(tempData);
        }
    }, [actionDatum]);

    useEffect(() => {
        if (!_.isUndefined(datum) && !_.isNull(datum)) setEditFormModalOpen(true);
    }, [datum]);

    const leftToolbarTemplate = () => {
        return (
            <div>
                <h5 className="m-0">{title ?? ''}</h5>
                <p className="m-0">{subtitle ?? ''}</p>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <Button
                    label={addNewItemButtonText ?? 'New'}
                    icon="pi pi-plus"
                    severity="success"
                    className=" mr-2"
                    onClick={
                        !postApiUri
                            ? undefined
                            : () => {
                                  setAddFormModalOpen(true);
                              }
                    }
                />
            </>
        );
    };

    return (
        <>
            {useMemo(
                () =>
                    !data ? null : (
                        <>
                            {!postApiUri ? null : (
                                <Toolbar
                                    className="mb-4"
                                    left={leftToolbarTemplate}
                                    right={rightToolbarTemplate}
                                ></Toolbar>
                            )}
                            <DataTable
                                data={data}
                                ignoredColumns={ignoredColumns}
                                actionIdentifier={actionIdentifier}
                                actions={actions}
                            />
                        </>
                    ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [data]
            )}
            {useMemo(
                () =>
                    !fields || _.size(fields) === 0 || !postApiUri ? null : (
                        <AddNewItemComponent
                            isFormModalOpen={isAddFormModalOpen}
                            setFormModalOpen={value => {
                                setAddFormModalOpen(value);
                            }}
                            postApiUri={postApiUri}
                            fields={fields}
                            nonEdibleFields={nonEdibleFields}
                            onSuccess={data => {
                                // console.debug({ data });

                                getAllData(getAllApiUri, getAllDataModificationCallback);

                                if (!_.isUndefined(addNewCallback) && !_.isNull(addNewCallback)) addNewCallback(data);
                            }}
                            name={name}
                        />
                    ),
                [isAddFormModalOpen]
            )}
            {useMemo(
                () =>
                    (!fields && !editFields) || !putApiUri || !putIdentifier || !datum ? null : (
                        <EditItemComponent
                            isFormModalOpen={isEditFormModalOpen}
                            setFormModalOpen={value => {
                                setEditFormModalOpen(value);
                            }}
                            putApiUri={putApiUri}
                            putIdentifier={putIdentifier}
                            datumId={datum.id}
                            datum={datum}
                            fields={!editFields ? fields : editFields}
                            nonEdibleFields={nonEdibleFields}
                            onSuccess={data => {
                                getAllData(getAllApiUri, getAllDataModificationCallback);

                                if (!_.isUndefined(editExistingCallback) && !_.isNull(editExistingCallback))
                                    editExistingCallback(data);
                            }}
                            name={name}
                        />
                    ),
                [isEditFormModalOpen, datum]
            )}
            {useMemo(
                () =>
                    !deleteApiUri || !deleteIdentifier || !datumId ? null : (
                        <DeleteItemComponent
                            isConfirmationModalOpen={isDeleteFormModalOpen}
                            setConfirmationModalOpen={setDeleteFormModalOpen}
                            deleteApiUri={deleteApiUri}
                            deleteIdentifier={deleteIdentifier}
                            datumId={datumId}
                            onSuccess={() => {
                                getAllData(getAllApiUri, getAllDataModificationCallback);

                                if (!_.isUndefined(removeOneCallback) && !_.isNull(removeOneCallback))
                                    removeOneCallback();
                            }}
                        />
                    ),
                [isDeleteFormModalOpen]
            )}
        </>
    );
}

export default GenericViewGenerator;

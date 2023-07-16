import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Toast } from 'primereact/toast';
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
    showToast,
}: {
    isConfirmationModalOpen: boolean;
    setConfirmationModalOpen: (isConfirmationModalOpen: boolean) => void;
    deleteApiUri: string;
    deleteIdentifier: string;
    datumId: string;
    onSuccess: () => void;
    showToast: (color: 'success' | 'warning' | 'error', title: string | null, message: string, ttl?: number) => void;
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
                    .then((response) => {
                        if (!response) {
                            showToast('error', 'Unsuccessful!', 'Server not working!');
                        }

                        if (response.statusCode !== 200) {
                            showToast('error', 'Unsuccessful!', response.message);
                        } else {
                            showToast('success', 'Success!', response.message);

                            onSuccess();
                        }
                    })
                    .catch((error) => {
                        console.error('error', error);

                        showToast('error', 'Unsuccessful!', 'Something went wrong!');
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
    showToast,
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
    showToast: (color: 'success' | 'warning' | 'error', title: string | null, message: string, ttl?: number) => void;
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

                    callPutApi(_.replace(putApiUri, putIdentifier, datumId), data)
                        .then((response) => {
                            if (!response) {
                                showToast('error', 'Unsuccessful!', 'Server not working!');
                            }

                            if (response.statusCode !== 200) {
                                showToast('error', 'Unsuccessful!', response.message);
                            } else {
                                showToast('success', 'Success!', response.message);

                                onSuccess(data);
                            }
                        })
                        .catch((error) => {
                            console.error('error', error);

                            showToast('error', 'Unsuccessful!', 'Something went wrong!');
                        })
                        .finally(() => {
                            callback();

                            setFormModalOpen(false);
                        });
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
    showToast,
    name,
}: {
    isFormModalOpen: boolean;
    setFormModalOpen: (value: boolean) => void;
    fields: any;
    nonEdibleFields?: string[];
    postApiUri: string;
    onSuccess: (data: any) => void;
    showToast: (color: 'success' | 'warning' | 'error', title: string | null, message: string, ttl?: number) => void;
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
                callback={(data, callback) => {
                    // console.debug({ data });

                    callPostApi(postApiUri, data)
                        .then((response) => {
                            if (!response) {
                                showToast('error', 'Unsuccessful!', 'Server not working!');
                            }

                            if (response.statusCode !== 200) {
                                showToast('error', 'Unsuccessful!', response.message);
                            } else {
                                showToast('success', 'Success!', response.message);

                                onSuccess(data);
                            }
                        })
                        .catch((error) => {
                            console.error('error', error);

                            showToast('error', 'Unsuccessful!', 'Something went wrong!');
                        })
                        .finally(() => {
                            callback();

                            setFormModalOpen(false);
                        });
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
    const toast = useRef(null);

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
        callGetApi(getApiUri)
            .then((response) => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                const tempData = !handleDataCallback ? response.data : handleDataCallback(response.data);

                setData(tempData);

                if (!_.isUndefined(getAllSuccessCallback) && !_.isNull(getAllSuccessCallback))
                    getAllSuccessCallback(response.data);
            })
            .catch((error) => {
                console.error('error', error);

                showToast('error', 'Unsuccessful!', error.message ?? 'Something went wrong!');
            });
    };

    const getDatum = (
        getOneApiUri: string,
        getOneIdentifier: string,
        value: string,
        handleDataCallback?: (data: any) => any
    ) => {
        callGetApi(_.replace(getOneApiUri, getOneIdentifier, value))
            .then((response) => {
                if (!response) throw { message: 'Server not working!' };

                if (response.statusCode !== 200) throw { message: response.message };

                setDatum(!handleDataCallback ? response.data : handleDataCallback(response.data));

                if (!_.isUndefined(getOneSuccessCallback) && !_.isNull(getOneSuccessCallback))
                    getOneSuccessCallback(response.data);
            })
            .catch((error) => {
                console.error('error', error);

                showToast('error', 'Unsuccessful!', error.message);
            });
    };

    useEffect(() => {
        const tempActions: IAction[] = [...actions];

        if (actionIdentifier && getOneApiUri && getOneIdentifier && putApiUri && putIdentifier) {
            tempActions.push({
                text: 'Edit',
                icon: 'pi pi-pencil',
                color: 'warning',
                callback: (id) => {
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
                callback: (id) => {
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

    const showToast = useCallback(
        (color: 'success' | 'warning' | 'error', title: string | null, message: string, ttl?: number) => {
            toast.current.show({ severity: color, summary: title ?? '', detail: message, life: ttl ?? 3000 });
        },
        []
    );

    return (
        <>
            {useMemo(
                () =>
                    !data ? null : (
                        <>
                            <DataTable
                                data={data}
                                ignoredColumns={ignoredColumns}
                                actionIdentifier={actionIdentifier}
                                actions={actions}
                                title={title}
                                subtitle={subtitle}
                                addNewItemButtonText={addNewItemButtonText ?? 'Add new item'}
                                addNewItemCallback={
                                    !postApiUri
                                        ? undefined
                                        : () => {
                                              setAddFormModalOpen(true);
                                          }
                                }
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
                            setFormModalOpen={(value) => {
                                setAddFormModalOpen(value);
                            }}
                            postApiUri={postApiUri}
                            fields={fields}
                            nonEdibleFields={nonEdibleFields}
                            onSuccess={(data) => {
                                // console.debug({ data });

                                getAllData(getAllApiUri, getAllDataModificationCallback);

                                if (!_.isUndefined(addNewCallback) && !_.isNull(addNewCallback)) addNewCallback(data);
                            }}
                            showToast={showToast}
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
                            setFormModalOpen={(value) => {
                                setEditFormModalOpen(value);
                            }}
                            putApiUri={putApiUri}
                            putIdentifier={putIdentifier}
                            datumId={datum.id}
                            datum={datum}
                            fields={!editFields ? fields : editFields}
                            nonEdibleFields={nonEdibleFields}
                            onSuccess={(data) => {
                                getAllData(getAllApiUri, getAllDataModificationCallback);

                                if (!_.isUndefined(editExistingCallback) && !_.isNull(editExistingCallback))
                                    editExistingCallback(data);
                            }}
                            showToast={showToast}
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
                            showToast={showToast}
                        />
                    ),
                [isDeleteFormModalOpen]
            )}
            <Toast ref={toast} />
        </>
    );
}

export default GenericViewGenerator;

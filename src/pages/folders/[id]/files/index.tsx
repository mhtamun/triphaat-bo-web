import React, { useMemo, useEffect, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericViewGenerator from '../../../../components/global/GenericViewGenerator';
import { getFolderById } from '../../../../apis';
import { getGeneralStatusOptions } from '../../../../utils';
import { UrlBasedColumnItem } from '../../../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'File Management | Folder', () => {
        const folderId = context.query.id;

        // console.debug({ folderId });

        return {
            folderId,
        };
    });

const Page = ({ folderId }: { folderId: string }) => {
    // console.debug({ folderId });

    const [folder, setFolder] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => {
        getFolderById(parseInt(folderId))
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                }

                if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setFolder(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});
    }, [folderId]);

    const fields = [
        {
            type: 'select-sync',
            name: 'folderId',
            placeholder: 'Select folder ID',
            title: 'Folder',
            initialValue: parseInt(folderId),
            options: !folder
                ? []
                : [
                      {
                          value: folder.id,
                          label: folder.name,
                      },
                  ],
            validate: (values: any) => {
                if (!values.folderId) return 'Required!';

                return null;
            },
            isDisabled: true,
        },
        {
            type: 'select-sync',
            name: 'type',
            placeholder: 'Select type!',
            title: 'TYPE',
            initialValue: 'UNSPECIFIED',
            options: [
                {
                    value: 'UNSPECIFIED',
                    label: 'UNSPECIFIED',
                },
                {
                    value: 'IMAGE',
                    label: 'IMAGE',
                },
                {
                    value: 'GIF',
                    label: 'GIF',
                },
                {
                    value: 'VIDEO',
                    label: 'VIDEO',
                },
                {
                    value: 'DOCUMENT',
                    label: 'DOCUMENT',
                },
            ],
        },
        {
            type: 'text',
            name: 'name',
            placeholder: 'Enter a name!',
            title: 'File Name',
            initialValue: null,
        },
        {
            type: 'file-select',
            name: 'url',
            placeholder: 'Select file!',
            title: 'File',
            initialValue: null,
            validate: (values: any) => {
                if (!values.url) return 'Required!';

                return null;
            },
        },
    ];

    return (
        <Card title={!folder ? null : folder.name}>
            {useMemo(
                () =>
                    !folder ? null : (
                        <GenericViewGenerator
                            name={'file'}
                            title="Files"
                            subtitle="Manage file here!"
                            viewAll={{
                                uri: `/api/v1/folders/${folderId}/files`,
                                ignoredColumns: ['id', 'folderId', 'folder', 'name', 'type', 'createdAt', 'updatedAt'],
                                scopedColumns: {
                                    url: (item: any) => <UrlBasedColumnItem url={item.url} />,
                                },
                                actionIdentifier: 'id',
                                onDataModify: data =>
                                    _.map(data, datum => ({
                                        ...datum,
                                        folder: datum.folder.name,
                                    })),
                            }}
                            addNew={{
                                uri: `/api/v1/files`,
                            }}
                            viewOne={{ uri: '/api/v1/files/{id}', identifier: '{id}' }}
                            editExisting={{ uri: '/api/v1/files/{id}', identifier: '{id}' }}
                            removeOne={{
                                uri: '/api/v1/files/{id}',
                                identifier: '{id}',
                            }}
                            fields={[
                                ...fields,
                                {
                                    type: 'select-sync',
                                    name: 'status',
                                    placeholder: 'Select status!',
                                    title: 'Status',
                                    initialValue: 'ACTIVE',
                                    options: getGeneralStatusOptions(),
                                    validate: (values: any) => {
                                        if (!values.status) return 'Required!';

                                        return null;
                                    },
                                },
                            ]}
                            editFields={[
                                {
                                    type: 'select-sync',
                                    name: 'status',
                                    placeholder: 'Select status!',
                                    title: 'Status',
                                    initialValue: 'ACTIVE',
                                    options: getGeneralStatusOptions(),
                                    validate: (values: any) => {
                                        if (!values.status) return 'Required!';

                                        return null;
                                    },
                                },
                            ]}
                        />
                    ),
                [folder]
            )}
        </Card>
    );
};

export default Page;

import React, { useMemo, useEffect, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericViewGenerator from '../../../../components/global/GenericViewGenerator';
import { getModuleNames, getPermissionTypes } from '../../../../apis';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Permission Management', () => {
        const roleId = context.query.id;

        // console.debug({ roleId });

        return {
            roleId,
        };
    });

const Page = ({ roleId }: { roleId: string }) => {
    // console.debug({ roleId });

    const [moduleNames, setModules] = useState(null);
    const [permissionTypes, setPermissionTypes] = useState(null);

    useEffect(() => {
        getModuleNames()
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                }

                if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setModules(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});

        getPermissionTypes()
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                }

                if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setPermissionTypes(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});
    }, []);

    return (
        <>
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'permission'}
                        title="Permissions"
                        subtitle="Manage permission here!"
                        viewAll={{
                            uri: `/api/v1/roles/${roleId}/permissions`,
                            ignoredColumns: ['id', 'roleId', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    role: datum.role.name,
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/permissions`,
                        }}
                        removeOne={{
                            uri: '/api/v1/permissions/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
                            {
                                type: 'number',
                                name: 'roleId',
                                placeholder: 'Select role ID',
                                title: 'Role ID',
                                initialValue: parseInt(roleId),
                                validate: (values: any) => {
                                    if (!values.roleId) return 'Required!';

                                    return null;
                                },
                                isDisabled: true,
                            },
                            {
                                type: 'select-sync',
                                name: 'moduleName',
                                placeholder: 'Select a module!',
                                title: 'Module Name',
                                initialValue: null,
                                options: moduleNames ?? [],
                                validate: (values: any) => {
                                    if (!values.moduleName) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'permissionType',
                                placeholder: 'Select a permission type!',
                                title: 'Permission Type',
                                initialValue: null,
                                options: permissionTypes ?? [],
                                validate: (values: any) => {
                                    if (!values.permissionType) return 'Required!';

                                    return null;
                                },
                            },
                        ]}
                    />
                ),
                [moduleNames, permissionTypes]
            )}
        </>
    );
};

export default Page;

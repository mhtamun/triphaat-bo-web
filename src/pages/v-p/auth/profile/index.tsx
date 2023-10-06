import React from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';

// application
import { getAuthorized } from '../../../../libs/auth';
import { BreadCrumb, GenericFormGenerator } from '../../../../components';
import { getProfile } from '../../../../apis';
import { getUserManagementFields } from '../../../users';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Profile | Auth | Vendor Panel | TripHaat', async cookies => {
        const responseGetProfile = await getProfile(`${cookies.accessType} ${cookies.accessToken}`);
        // console.debug({ responseGetProfile });

        if (!responseGetProfile || responseGetProfile.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            isVendor: true,
            user: responseGetProfile.data,
        };
    });

const IndexPage = ({ user }: { user: any }) => {
    console.debug({ user });

    const router = useRouter();

    return (
        <>
            <BreadCrumb router={router} />
            <Card>
                <GenericFormGenerator
                    datum={user}
                    fields={getUserManagementFields([{ id: user.roleId, name: user.role.name }])
                        .filter(field => field.name !== 'password')
                        .map(field => ({ ...field, isDisabled: true }))}
                    callback={values => {
                        // console.debug({ values });
                    }}
                    submitButtonShow={false}
                    enableReinitialize={false}
                />
            </Card>
        </>
    );
};

export default IndexPage;

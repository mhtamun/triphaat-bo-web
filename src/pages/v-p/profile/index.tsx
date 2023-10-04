import React from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';

// application
import { getAuthorized } from '../../../libs/auth';
import { BreadCrumb } from '../../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Dashboard | Vendor Panel', async cookies => {
        return {
            isVendor: true,
        };
    });

const IndexPage = ({}: {}) => {
    const router = useRouter();

    return (
        <>
            <BreadCrumb router={router} />
            <Card title="Profile" subTitle="Manage your profile">
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                    repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam
                    perferendis esse, cupiditate neque quas!
                </p>
            </Card>
        </>
    );
};

export default IndexPage;

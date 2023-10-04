import React from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Badge } from 'primereact/badge';

// application
import { getAuthorized } from '../../../libs/auth';
import { BreadCrumb } from '../../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Profile | Administration | Vendor Panel', async cookies => {
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
                <div className="card flex flex-row flex-wrap justify-content-between align-content-center">
                    <div>
                        <Badge value="Status" size="xlarge" severity="success" />
                    </div>
                    <Image
                        className="align-items-center"
                        src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
                        alt="Image"
                        width="250"
                    />
                </div>
            </Card>
        </>
    );
};

export default IndexPage;

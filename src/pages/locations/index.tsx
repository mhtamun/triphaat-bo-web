import React from 'react';

// third-party
import { GetServerSideProps } from 'next';

// application
import { getAuthorized } from '../../libs/auth';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Location Management | Admin Panel | TripHaat', () => {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    });

const Page = () => {
    return <></>;
};

export default Page;

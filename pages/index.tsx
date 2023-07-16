import React from 'react';

// third-party
import { GetServerSideProps } from 'next';

// application
import { getAuthorized } from '../libs/auth';

export const getServerSideProps: GetServerSideProps = async (context) => getAuthorized(context);

const IndexPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Empty Page</h5>
                    <p>Use this page to start from scratch and place your custom content.</p>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;

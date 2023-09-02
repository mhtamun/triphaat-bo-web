import React from 'react';

// third-party
import { GetServerSideProps } from 'next';

// application
import { getAuthorized } from '../libs/auth';
import { showToast } from '../utils/toast';
import { callGetApi } from '../libs/api';

export const getServerSideProps: GetServerSideProps = async context => getAuthorized(context, 'Dashboard');

const IndexPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Empty Page</h5>
                    <p>Use this page to start from scratch and place your custom content.</p>
                    <button
                        onClick={e => {
                            // showToast('Hello', 'info');

                            callGetApi('/api/v1/roles', null, true)
                                .then(response => {
                                    // console.debug({ response });
                                })
                                .catch(error => {});
                        }}
                    >
                        Hello
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;

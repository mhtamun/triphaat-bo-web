import { useRouter } from 'next/router';
import React from 'react';
// import AppConfig from '../../components/layout/AppConfig';
import { Button } from 'primereact/button';
import type { Page } from '../../types/types';

const ErrorPage: Page = () => {
    const router = useRouter();

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div
                        className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
                        style={{ borderRadius: '53px' }}
                    >
                        <div
                            className="flex justify-content-center align-items-center bg-pink-500 border-circle"
                            style={{ height: '3.2rem', width: '3.2rem' }}
                        >
                            <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                        </div>
                        <h1 className="text-900 font-bold text-5xl mb-2">Error Occured</h1>
                        <p className="text-600 mb-5">Something went wrong.</p>
                        {/* eslint-disable @next/next/no-img-element */}
                        <img src="/images/asset-error.svg" alt="Error 500" className="mb-5" width="80%" />
                        <Button onClick={() => router.push('/')}>Go to Dashboard</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ErrorPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            {/* <AppConfig simple /> */}
        </React.Fragment>
    );
};

export default ErrorPage;

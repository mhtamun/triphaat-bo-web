import React from 'react';

// third-party libraries
import type { AppProps } from 'next/app';
import PrimeReact from 'primereact/api';

// application libraries
import type { Page } from '../types/types';
import { LayoutProvider } from '../components/layout/context/layoutcontext';
import Layout from '../components/layout/layout';

// global styles configuration
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';

PrimeReact.zIndex = {
    modal: 1100,
    overlay: 1000,
    menu: 9999,
    tooltip: 1100,
    toast: 1200,
};

type Props = AppProps & {
    Component: Page;
};

export default function MyApp({ Component, pageProps }: Props) {
    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
    } else {
        return (
            <LayoutProvider>
                <Layout title={pageProps.title ?? ''} isVendor={pageProps.isVendor}>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
}

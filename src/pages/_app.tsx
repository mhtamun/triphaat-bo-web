import React from 'react';

// third-party libraries
import type { AppProps } from 'next/app';
import PrimeReact from 'primereact/api';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

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
    modal: 999999,
    overlay: 9999999,
    menu: 99999,
    tooltip: 99999999,
    toast: 9999999,
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

import React from 'react';

// third-party
import { GetServerSideProps } from 'next';

// application
import { getAuthorized } from '../../libs/auth';
import {
    getTotalBalancePaymentOfTripsForVendor,
    getCurrentMonthBalancePaymentOfTripsForVendor,
    getTotalCountNumberOfTripsForVendor,
} from '../../apis';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Dashboard', async cookies => {
        const responseCountNumberOfTrips = await getTotalCountNumberOfTripsForVendor(
            `${cookies.accessType} ${cookies.accessToken}`
        );
        // console.debug({ responseCountNumberOfTrips });

        const responseTotalBalancePaymentOfTrips = await getTotalBalancePaymentOfTripsForVendor(
            `${cookies.accessType} ${cookies.accessToken}`
        );
        // console.debug({ responseTotalBalancePaymentOfTrips });

        const responseCurrentMonthBalancePaymentOfTrips = await getCurrentMonthBalancePaymentOfTripsForVendor(
            `${cookies.accessType} ${cookies.accessToken}`
        );
        // console.debug({ responseCurrentMonthBalancePaymentOfTrips });

        if (
            !responseCountNumberOfTrips ||
            responseCountNumberOfTrips.statusCode !== 200 ||
            !responseTotalBalancePaymentOfTrips ||
            responseTotalBalancePaymentOfTrips.statusCode !== 200 ||
            !responseCurrentMonthBalancePaymentOfTrips ||
            responseCurrentMonthBalancePaymentOfTrips.statusCode !== 200
        ) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            isVendor: true,
            countNumberOfTrips: responseCountNumberOfTrips.data,
            totalBalancePaymentOfTrips: responseTotalBalancePaymentOfTrips.data,
            currentMonthBalancePaymentOfTrips: responseCurrentMonthBalancePaymentOfTrips.data,
        };
    });

const IndexPage = ({
    countNumberOfTrips,
    totalBalancePaymentOfTrips,
    currentMonthBalancePaymentOfTrips,
}: {
    countNumberOfTrips: number;
    totalBalancePaymentOfTrips: number;
    currentMonthBalancePaymentOfTrips: number;
}) => {
    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Trips</span>
                            <div className="text-900 font-medium text-xl">{countNumberOfTrips}</div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-orange-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    {/* <span className="text-green-500 font-medium">24 new </span>
                    <span className="text-500">since last visit</span> */}
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Balance</span>
                            <div className="text-900 font-medium text-xl">BDT {totalBalancePaymentOfTrips}</div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-green-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-money-bill text-green-500 text-xl" />
                        </div>
                    </div>
                    {/* <span className="text-green-500 font-medium">%52+ </span>
                    <span className="text-500">since last week</span> */}
                </div>
            </div>{' '}
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Current Month Balance</span>
                            <div className="text-900 font-medium text-xl">BDT {currentMonthBalancePaymentOfTrips}</div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-green-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-money-bill text-green-500 text-xl" />
                        </div>
                    </div>
                    {/* <span className="text-green-500 font-medium">%52+ </span>
                    <span className="text-500">since last week</span> */}
                </div>
            </div>
        </div>
    );
};

export default IndexPage;

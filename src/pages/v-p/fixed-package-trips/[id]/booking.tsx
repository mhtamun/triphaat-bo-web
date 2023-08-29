import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../libs/auth';
import GenericFormGenerator from '../../../../components/global/GenericFormGenerator';
import { getTripForVendor, getTripVariants, initBooking } from '../../../../apis';
import { FormikValues } from 'formik';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Booking | Fixed Package Trip', async cookies => {
        const tripId = context.query.id;
        // console.debug({
        //     tripId,
        // });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);
        const responseGetTripVariants = await getTripVariants(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            tripId,
            `${cookies.accessType} ${cookies.accessToken}`
        );
        const responseInitBooking = await initBooking({
            tripId: parseInt(tripId as string),
        });

        if (
            !responseGetTrip ||
            responseGetTrip.statusCode !== 200 ||
            !responseGetTripVariants ||
            responseGetTripVariants.statusCode !== 200 ||
            !responseInitBooking ||
            responseInitBooking.statusCode !== 200
        ) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        // console.debug({
        //     initBooking: responseInitBooking.data,
        // });

        return {
            isVendor: true,
            tripId,
            trip: responseGetTrip.data,
            variants: responseGetTripVariants.data,
        };
    });

const Page = ({ tripId, trip, variants }: { tripId: string; trip: any; variants: any[] }) => {
    const router = useRouter();

    return (
        <>
            <div className="flex justify-content-between flex-wrap mb-3">
                <Button
                    className="btn-block"
                    icon="pi pi-angle-left"
                    label={'Cancel'}
                    severity={'danger'}
                    raised
                    onClick={e => {
                        e.preventDefault();
                    }}
                />
            </div>
            <Card title={trip?.name}>
                <GenericFormGenerator
                    fields={[
                        {
                            type: 'select-sync',
                            name: 'variantId',
                            placeholder: 'Select a price package!',
                            title: 'Please Select a Price Package Variant',
                            initialValue: null,
                            options: _.map(variants, variant => ({
                                value: variant.id,
                                label: !variant.offerPricePerPerson
                                    ? variant.pricePerPerson
                                    : !parseFloat(variant.offerPricePerPerson)
                                    ? variant.pricePerPerson
                                    : variant.offerPricePerPerson,
                            })),
                            validate: (values: any) => {
                                if (!values.variantId) return 'Required!';

                                return null;
                            },
                        },
                    ]}
                    submitButtonShow={false}
                    onValueModify={(values: FormikValues) => {
                        console.debug({ values });
                    }}
                />
            </Card>
        </>
    );
};

export default Page;

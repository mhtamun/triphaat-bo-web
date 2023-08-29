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
import { getTripForVendor } from '../../../../apis';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Booking | Fixed Package Trip', async cookies => {
        const tripId = context.query.id;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetTrip || responseGetTrip.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            isVendor: true,
            tripId,
            trip: responseGetTrip.data,
        };
    });

const Page = ({ tripId, trip }: { tripId: string; trip: any }) => {
    const router = useRouter();

    return (
        <>
            <div className="flex justify-content-start flex-wrap mb-3">
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
                    fields={[]}
                    nonEdibleFields={[]}
                    submitButtonShow={false}
                    callback={(data, callback) => {
                        // console.debug({ data });
                    }}
                />
            </Card>
        </>
    );
};

export default Page;

import React, { useMemo, useState, useEffect } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../libs/auth';
import { getTrip } from '../../../apis';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Tags | Trip Management', () => {
        const tripId = context.query.id;

        // console.debug({ roleId });

        return {
            tripId,
        };
    });

const Page = ({ tripId }: { tripId: string }) => {
    const router = useRouter();

    const [trip, setTrip] = useState(null);

    useEffect(() => {
        getTrip(tripId)
            .then(response => {
                if (!response) {
                    // showToast('error', 'Unsuccessful!', 'Server not working!');
                } else if (response.statusCode !== 200) {
                    // showToast('error', 'Unsuccessful!', response.message);
                } else {
                    // showToast('success', 'Success!', response.message);

                    setTrip(response.data);
                }
            })
            .catch(error => {
                console.error('error', error);

                // showToast('error', 'Unsuccessful!', 'Something went wrong!');
            })
            .finally(() => {});
    }, []);

    return (
        <>
            <Card title={trip?.name} className="mb-3">
                <TabView
                    activeIndex={4}
                    onTabChange={e => {
                        if (e.index === 0) router.push(`/trips/${tripId}`);
                        if (e.index === 1) router.push(`/trips/${tripId}/variants`);
                        if (e.index === 2) router.push(`/trips/${tripId}/images`);
                        if (e.index === 3) router.push(`/trips/${tripId}/videos`);
                        // if (e.index === 4) router.push(`/trips/${tripId}/tags`);
                    }}
                >
                    <TabPanel header="Details"></TabPanel>
                    <TabPanel header="Variants"></TabPanel>
                    <TabPanel header="Images"></TabPanel>
                    <TabPanel header="Videos"></TabPanel>
                    <TabPanel header="Tags"></TabPanel>
                </TabView>
            </Card>
        </>
    );
};

export default Page;

import React, { useMemo, useState } from 'react';

// third-party libraries
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import _ from 'lodash';

// application libraries
import { getAuthorized } from '../../../../../../libs/auth';
import GenericFormGenerator from '../../../../../../components/global/GenericFormGenerator';
import { copyTrip, deactivateTrip, getCategories, getLocations, getTripForVendor } from '../../../../../../apis';
import { callPutApi } from '../../../../../../libs/api';
import { getTripFields } from '../../../t/[type]/create';
import TabViewComponent from '../../../../../../components/trips/TabViewComponent';
import WrapperComponent from '../../../../../../components/trips/WrapperComponent';
import { getTripType } from '../../../../../../utils';
import { showToast } from '../../../../../../utils/toast';
import { ModalConfirmation } from '../../../../../../components';
import handleResponseIfError from '../../../../../../utils/responseHandler';
import { ICategory } from '../../../../../../types';

export interface ILocation {
    id: number;
    name: string;
    city: {
        name: string;
        state: {
            name: string;
            country: {
                name: string;
            };
        };
    };
}

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Details | Trip Management', async cookies => {
        const tripId = context.query.tripId;

        const responseGetCategories = await getCategories(`${cookies.accessType} ${cookies.accessToken}`);
        const responseGetLocations = await getLocations(`${cookies.accessType} ${cookies.accessToken}`);
        const responseGetTrip = await getTripForVendor(
            tripId as string,
            `${cookies.accessType} ${cookies.accessToken}`
        );

        const responseError = handleResponseIfError(context, responseGetCategories, responseGetLocations);
        if (responseError !== null) return responseError;

        return {
            isVendor: true,
            tripId,
            categories: responseGetCategories.data,
            locations: responseGetLocations.data,
            trip: responseGetTrip.data,
        };
    });

const Page = ({
    tripId,
    categories,
    locations,
    trip,
}: {
    tripId: string;
    categories: ICategory[];
    locations: ILocation[];
    trip: any;
}) => {
    const router = useRouter();

    const types = getTripType(router);

    const [isCopyConfirmationModalOpen, setCopyConfirmationModalOpen] = useState<boolean>(false);
    const [isDeactivateConfirmationModalOpen, setDeactivateConfirmationModalOpen] = useState<boolean>(false);

    return (
        <WrapperComponent
            title={trip?.name}
            tripId={tripId}
            router={router}
            copyTripCallBack={() => {
                setCopyConfirmationModalOpen(true);
            }}
            deactivateTripCallBack={() => {
                setDeactivateConfirmationModalOpen(true);
            }}
        >
            <TabViewComponent
                router={router}
                tripId={tripId}
                content={useMemo(
                    () =>
                        !locations || _.size(locations) === 0 || !trip ? null : (
                            <GenericFormGenerator
                                datum={{
                                    ...trip,
                                }}
                                fields={getTripFields(
                                    categories,
                                    locations,
                                    types.dateType,
                                    types.accommodationType,
                                    types.transportationType,
                                    types.foodType,
                                    router.query.type as string
                                )}
                                callback={data => {
                                    // console.debug({ data });

                                    callPutApi('/vendor/api/v1/trips/' + tripId, data, null, null, true)
                                        .then(response => {
                                            if (!response) throw { message: 'Server not working!' };

                                            if (response.statusCode !== 200) throw { message: response.message };

                                            showToast(response.message, 'success', { autoClose: 500 });
                                        })
                                        .catch(error => {
                                            console.error('error', error);
                                        })
                                        .finally(() => {});
                                }}
                                submitButtonText="Save"
                            />
                        ),
                    [trip]
                )}
            />
            <ModalConfirmation
                isOpen={isCopyConfirmationModalOpen}
                onCancel={() => {
                    setCopyConfirmationModalOpen(!isCopyConfirmationModalOpen);
                }}
                title="Are you sure you want to copy this trip?"
                subtitle="You have to set the dates of the trip after copy"
                cancelCallback={() => {
                    setCopyConfirmationModalOpen(!isCopyConfirmationModalOpen);
                }}
                cancelColor="danger"
                confirmCallback={() => {
                    setCopyConfirmationModalOpen(!isCopyConfirmationModalOpen);

                    copyTrip(tripId)
                        .then(response => {
                            if (!response) throw { message: 'Server not working!' };

                            if (response.statusCode !== 200) throw { message: response.message };

                            showToast(response.message, 'success', { autoClose: 500 });

                            router.push(`/v-p/trips/t/${router.query.type}`);
                        })
                        .catch(error => {
                            console.error('error', error);
                        })
                        .finally(() => {});
                }}
                confirmColor="success"
            />
            <ModalConfirmation
                isOpen={isDeactivateConfirmationModalOpen}
                onCancel={() => {
                    setDeactivateConfirmationModalOpen(!isDeactivateConfirmationModalOpen);
                }}
                title="Are you sure you want to deactivate this trip?"
                subtitle="You can reactivate by changing teh status of this trip"
                cancelCallback={() => {
                    setDeactivateConfirmationModalOpen(!isDeactivateConfirmationModalOpen);
                }}
                cancelColor="success"
                confirmCallback={() => {
                    setDeactivateConfirmationModalOpen(!isDeactivateConfirmationModalOpen);

                    deactivateTrip(tripId)
                        .then(response => {
                            if (!response) throw { message: 'Server not working!' };

                            if (response.statusCode !== 200) throw { message: response.message };

                            showToast(response.message, 'success', { autoClose: 500 });

                            router.reload();
                        })
                        .catch(error => {
                            console.error('error', error);
                        })
                        .finally(() => {});
                }}
            />
        </WrapperComponent>
    );
};

export default Page;

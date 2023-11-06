import React, { useCallback, useState } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import { Fieldset } from 'primereact/fieldset';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import _ from 'lodash';

// application
import { getAuthorized } from '../../../../../../libs/auth';
import { WrapperComponent, GenericFormGenerator } from '../../../../../../components';
import { getTripForVendor, addRoom, getRooms, removeRoom } from '../../../../../../apis';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Service Dates | Trip Management', async cookies => {
        const tripId = context.query.tripId as string;

        const responseGetTrip = await getTripForVendor(tripId, `${cookies.accessType} ${cookies.accessToken}`);
        const responseGetRooms = await getRooms(tripId, `${cookies.accessType} ${cookies.accessToken}`);

        if (
            !responseGetTrip ||
            responseGetTrip.statusCode !== 200 ||
            !responseGetRooms ||
            responseGetRooms.statusCode !== 200
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
            tripId,
            trip: responseGetTrip.data,
            roomSeats: responseGetRooms.data,
        };
    });

const Page = ({ tripId, trip, roomSeats }: { tripId: string; trip: any; roomSeats: any[] }) => {
    const router = useRouter();

    const [rooms, setRooms] = useState<any[]>(roomSeats);
    console.debug({ rooms });

    const actionTemplate = (roomId: number) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    onClick={() => {
                        removeRoom(roomId.toString())
                            .then(response => {
                                // console.debug({ response });

                                if (!response) throw new Error('Something went wrong!');

                                if (response.statusCode !== 200) throw new Error(response.message);

                                const tempRooms = [...rooms];
                                const index = tempRooms.findIndex(room => room.id === roomId);
                                tempRooms.splice(index, 1);

                                setRooms(tempRooms);
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }}
                ></Button>
            </div>
        );
    };

    return (
        <WrapperComponent tripId={tripId} title={trip?.name} router={router}>
            <Fieldset legend="Add room seats">
                <GenericFormGenerator
                    fields={[
                        {
                            type: 'hidden',
                            name: 'tripId',
                            placeholder: '',
                            title: '',
                            initialValue: parseInt(tripId),
                            validate: (values: any) => {
                                if (!values.tripId) return 'Required!';

                                return null;
                            },
                        },
                        {
                            type: 'text',
                            name: 'identifier',
                            placeholder: 'Enter a room name or title',
                            title: 'Room Title',
                            initialValue: null,
                            validate: (values: any) => {
                                if (!values.identifier) return 'Required!';

                                return null;
                            },
                            col: 2,
                        },
                        {
                            type: 'text',
                            name: 'type',
                            placeholder: 'Enter a type of the room',
                            title: 'Room Type',
                            initialValue: null,
                            validate: (values: any) => {
                                return null;
                            },
                        },
                        {
                            type: 'textarea',
                            name: 'description',
                            placeholder: 'Enter a description of the room',
                            title: 'Room Description',
                            initialValue: null,
                        },
                        {
                            type: 'number',
                            name: 'maxOccupancy',
                            placeholder: 'Maximum number of occupant (if applicable)',
                            title: 'Room Maximum Occupancy',
                            initialValue: null,
                            validate: (values: any) => {
                                return null;
                            },
                            col: 2,
                        },
                        {
                            type: 'number',
                            name: 'numberOfSeats',
                            placeholder: 'Number of seats inside the room',
                            title: 'Room Seats',
                            initialValue: null,
                            validate: (values: any) => {
                                if (
                                    router.query.type === '1100' &&
                                    (_.isUndefined(values.numberOfSeats) || _.isNull(values.numberOfSeats))
                                )
                                    return 'Required!';

                                return null;
                            },
                        },
                    ]}
                    submitButtonShow={true}
                    submitButtonText="Add Room"
                    callback={(values: FormikValues, resetForm) => {
                        // console.debug({ values });

                        addRoom({
                            tripId: values.tripId,
                            identifier: values.identifier,
                            type: values.type,
                            description: values.description,
                            maxOccupancy: values.maxOccupancy,
                            numberOfSeats: values.numberOfSeats,
                        })
                            .then(response => {
                                // console.debug({ response });

                                if (!response) throw new Error('Something went wrong!');

                                if (response.statusCode !== 200) throw new Error(response.message);

                                const tempRooms = [...rooms, response.data];
                                setRooms(tempRooms);

                                if (resetForm) resetForm();
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }}
                    enableReinitialize={false}
                />
            </Fieldset>
            <Fieldset legend="View room seats" className="mt-3">
                <TreeTable
                    value={[...rooms].map((room: any) => ({
                        key: `${room.id}`,
                        data: {
                            identifier: room.identifier,
                            description: room.description,
                            type: 'Room',
                            action: actionTemplate(room.id),
                        },
                        children: room.seats.map((seat: any) => ({
                            key: `${room.id}-${seat.id}`,
                            data: {
                                identifier: seat.identifier,
                                description: seat.description,
                                type: 'Seat',
                            },
                        })),
                    }))}
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column field="identifier" header="Name" expander sortable></Column>
                    <Column field="description" header="Description"></Column>
                    <Column field="type" header="Type"></Column>
                    <Column field="action" header="Action" headerClassName="w-10rem" />
                </TreeTable>
            </Fieldset>
        </WrapperComponent>
    );
};

export default Page;

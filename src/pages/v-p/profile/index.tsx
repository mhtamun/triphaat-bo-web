import React from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { Image } from 'primereact/image';
import { Badge } from 'primereact/badge';

// application
import { getAuthorized } from '../../../libs/auth';
import { BreadCrumb, GenericFormGenerator } from '../../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Profile | Administration | Vendor Panel | TripHaat', async cookies => {
        return {
            isVendor: true,
        };
    });

const IndexPage = ({}: {}) => {
    const router = useRouter();

    return (
        <>
            <BreadCrumb router={router} />
            <Card title="Business Name" subTitle="Address">
                <Fieldset>
                    <div className="flex flex-row flex-wrap justify-content-between align-content-center">
                        <div>
                            <h6>
                                Phone: <strong>value</strong>
                            </h6>
                            <h6>
                                Email: <strong>value</strong>
                            </h6>
                            <h6>
                                Manual Booking Commission: <strong>value</strong>
                            </h6>
                            <h6>
                                Only Pgw Use Commission: <strong>value</strong>
                            </h6>
                            <h6>
                                Website Booking On Season Commission: <strong>value</strong>
                            </h6>
                            <h6>
                                Website Booking Off Season Commission: <strong>value</strong>
                            </h6>
                            <h6>
                                Status: <Badge value="Status" severity="success" />
                            </h6>
                        </div>
                        <Image
                            className="align-items-center"
                            src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
                            alt="Image"
                            width="150"
                            preview
                        />
                    </div>
                </Fieldset>
                <div className="grid mt-3">
                    <div className="xl:col-9 lg:col-8 md:col-12 sm:col-12">
                        <Fieldset legend="Information Update">
                            <GenericFormGenerator
                                fields={[
                                    {
                                        type: 'email',
                                        name: 'email',
                                        placeholder: 'Enter an email!',
                                        title: 'Email',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.email) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'phone',
                                        placeholder: 'Enter a phone number!',
                                        title: 'Phone Number',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.phone) return 'Required!';

                                            if (values.phone && !values.phone.startsWith('+880'))
                                                return 'Please enter code +880 before number!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'businessName',
                                        placeholder: 'Enter business name!',
                                        title: 'Business Name',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.businessName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'businessAddress',
                                        placeholder: 'Enter business address!',
                                        title: 'Business Address',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.businessAddress) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'responsiblePersonName',
                                        placeholder: 'Enter responsible person name!',
                                        title: 'Responsible Person Name',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.responsiblePersonName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'responsiblePersonEmail',
                                        placeholder: 'Enter responsible person email address!',
                                        title: 'Responsible Person Email Address',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.responsiblePersonEmail) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'responsiblePersonPhone',
                                        placeholder: 'Enter responsible person phone number!',
                                        title: 'Responsible Person Phone Number',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.responsiblePersonPhone) return 'Required!';

                                            if (values.phone && !values.phone.startsWith('+880'))
                                                return 'Please enter code +880 before number!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'responsiblePersonNid',
                                        placeholder: 'Enter responsible person NID number!',
                                        title: 'Responsible Person NID Number',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.responsiblePersonNid) return 'Required!';

                                            return null;
                                        },
                                    },
                                ]}
                                callback={values => {
                                    // console.debug({ values });
                                }}
                                submitButtonShow={true}
                                submitButtonText="Update"
                                enableReinitialize={false}
                            />
                        </Fieldset>
                    </div>
                    <div className="xl:col-3 lg:col-4 md:col-12 sm:col-12">
                        <Fieldset legend="Images" className="mt-3">
                            <Image
                                src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
                                alt="Image"
                                width="90"
                                preview
                            />
                        </Fieldset>
                        <Fieldset legend="Images" className="mt-3">
                            <Image
                                src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
                                alt="Image"
                                width="90"
                                preview
                            />
                        </Fieldset>
                        <Fieldset legend="Images" className="mt-3">
                            <Image
                                src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
                                alt="Image"
                                width="90"
                                preview
                            />
                        </Fieldset>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default IndexPage;

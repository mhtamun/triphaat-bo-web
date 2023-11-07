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
import {
    getVendorProfile,
    updateVendorProfile,
    updateVendorProfileLicense,
    updateVendorProfileLogo,
    updateVendorProfileRp,
    updateVendorProfileRpNid,
} from '../../../apis';
import { IVendor } from '../../../types';
import { getFormData } from '../../../utils';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Profile | Administration | Vendor Panel | TripHaat', async cookies => {
        const responseGetVendorProfile = await getVendorProfile(`${cookies.accessType} ${cookies.accessToken}`);

        if (!responseGetVendorProfile || responseGetVendorProfile.statusCode !== 200) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            isVendor: true,
            vendor: responseGetVendorProfile.data,
        };
    });

const IndexPage = ({ vendor }: { vendor: IVendor }) => {
    console.debug({ vendor });

    const router = useRouter();

    return (
        <>
            <BreadCrumb router={router} />
            <Card title={vendor.businessName} subTitle={vendor.businessAddress}>
                <Fieldset>
                    <div className="flex flex-row flex-wrap justify-content-between align-content-center">
                        <div>
                            <h6>
                                Phone: <strong>{vendor.phone}</strong>
                            </h6>
                            <h6>
                                Email: <strong>{vendor.email}</strong>
                            </h6>
                            <h6>
                                Manual Booking Commission: <strong>{vendor.manualBookingCommission}</strong>
                            </h6>
                            <h6>
                                Only Pgw Use Commission: <strong>{vendor.onlyPgwUseCommission}</strong>
                            </h6>
                            <h6>
                                Website Booking On Season Commission:{' '}
                                <strong>{vendor.websiteBookingOnCommission}</strong>
                            </h6>
                            <h6>
                                Website Booking Off Season Commission:{' '}
                                <strong>{vendor.websiteBookingOffCommission}</strong>
                            </h6>
                            <h6>
                                Status:{' '}
                                <Badge
                                    value={vendor.status}
                                    severity={vendor.status === 'PERMITTED' ? 'success' : 'danger'}
                                />
                                <strong>{vendor.bannedReason}</strong>
                            </h6>
                        </div>
                        <Image
                            className="align-items-center"
                            src={vendor.logoImageUrl ?? '/images/image-placeholder.png'}
                            alt="Image"
                            width="150"
                            preview
                        />
                    </div>
                </Fieldset>
                <div className="grid mt-3">
                    <div className="xl:col-7 lg:col-6 md:col-12 sm:col-12">
                        <Fieldset legend="Information Update">
                            <GenericFormGenerator
                                datum={vendor}
                                fields={[
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
                                        name: 'responsiblePersonDesignation',
                                        placeholder: 'Enter responsible person designation!',
                                        title: 'Responsible Person Designation',
                                        initialValue: null,
                                        validate: (values: any) => {
                                            if (!values.responsiblePersonDesignation) return 'Required!';

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

                                            if (values.phone && !values.responsiblePersonPhone.startsWith('+880'))
                                                return 'Please enter code +88 before number!';

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
                                    {
                                        type: 'select-sync',
                                        name: 'paymentType',
                                        placeholder: 'Select payment type!',
                                        title: 'Payment Type',
                                        initialValue: null,
                                        options: [
                                            { value: 'CASH_PAY', label: 'CASH PAY' },
                                            { value: 'BANK_PAY', label: 'BANK PAY' },
                                            { value: 'CARD_PAY', label: 'CARD PAY' },
                                            { value: 'CHECK_PAY', label: 'CHECK PAY' },
                                            { value: 'MFS_PAY', label: 'MFS PAY' },
                                            { value: 'OTHER_PAY', label: 'OTHER PAY' },
                                        ],
                                        validate: (values: any) => {
                                            if (!values.paymentType) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'bankAccountNumber',
                                        placeholder: 'Enter bank account number!',
                                        title: 'Bank Account Number',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'BANK_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.bankAccountNumber) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'bankAccountName',
                                        placeholder: 'Enter bank account name!',
                                        title: 'Bank Account Name',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'BANK_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.bankAccountName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'bankName',
                                        placeholder: 'Enter bank name!',
                                        title: 'Bank Name',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'BANK_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.bankName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'bankBranchDistrictName',
                                        placeholder: 'Enter bank branch district name!',
                                        title: 'Bank Branch District Name',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'BANK_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.bankBranchDistrictName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'bankBranchName',
                                        placeholder: 'Enter bank branch name!',
                                        title: 'Bank Branch Name',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'BANK_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.bankBranchName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'bankBranchRoutingNumber',
                                        placeholder: 'Enter bank branch routing number!',
                                        title: 'Bank Branch Routing Number',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'BANK_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.bankBranchRoutingNumber) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'cardNumber',
                                        placeholder: 'Enter card number!',
                                        title: 'Card Number',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'CARD_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.cardNumber) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'cardAccountName',
                                        placeholder: 'Enter card account name!',
                                        title: 'Card Account Name',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'CARD_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.cardAccountName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'cardBankName',
                                        placeholder: 'Enter card bank name!',
                                        title: 'Card Bank Name',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'CARD_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.cardBankName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'checkPayToName',
                                        placeholder: 'Enter check pay to name!',
                                        title: 'Check Pay To Name',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'CHECK_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.checkPayToName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'select-sync',
                                        name: 'mfsName',
                                        placeholder: 'Select mfs type!',
                                        title: 'MFS Name',
                                        initialValue: null,
                                        options: [
                                            { value: 'bKash', label: 'bKash' },
                                            { value: 'Nagad', label: 'Nagad' },
                                            { value: 'Rocket', label: 'Rocket' },
                                            { value: 'Upay', label: 'Upay' },
                                            { value: 'SureCash', label: 'SureCash' },
                                            { value: 'mCash', label: 'mCash' },
                                            { value: 'MyCash', label: 'MyCash' },
                                            { value: 'Tap', label: 'Tap' },
                                            { value: 'FirstCash', label: 'FirstCash' },
                                            { value: 'OK Wallet', label: 'OK Wallet' },
                                            { value: 'TeleCash', label: 'TeleCash' },
                                            { value: 'Meghna Pay', label: 'Meghna Pay' },
                                        ],
                                        show: values => {
                                            if (values.paymentType !== 'MFS_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.mfsName) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'mfsNumber',
                                        placeholder: 'Enter mfs number!',
                                        title: 'Check Pay To Name',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'MFS_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.mfsNumber) return 'Required!';

                                            return null;
                                        },
                                    },
                                    {
                                        type: 'text',
                                        name: 'otherPayNote',
                                        placeholder: 'Enter note (if applicable)!',
                                        title: 'Other Type Payment Note',
                                        initialValue: null,
                                        show: values => {
                                            if (values.paymentType !== 'OTHER_PAY') return false;

                                            return true;
                                        },
                                        validate: (values: any) => {
                                            if (!values.otherPayNote) return 'Required!';

                                            return null;
                                        },
                                    },
                                ]}
                                callback={values => {
                                    console.debug({ values });

                                    updateVendorProfile(values)
                                        .then(response => {
                                            // console.debug({ response });

                                            if (!response) throw new Error('Something went wrong!');
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }}
                                submitButtonShow={true}
                                submitButtonText="Update"
                                enableReinitialize={false}
                            />
                            <div className="mt-3" />
                            <GenericFormGenerator
                                fields={[
                                    {
                                        type: 'file-select',
                                        name: 'logoImageUrl',
                                        placeholder: 'Select logo image file!',
                                        title: 'To update logo image, please choose a file from the option below and press update',
                                        initialValue: null,
                                        acceptType: 'image/*',
                                        maxFileSize: 1048576,
                                        validate: (values: any) => {
                                            if (!values.logoImageUrl) return 'Required!';

                                            return null;
                                        },
                                    },
                                ]}
                                callback={values => {
                                    // console.debug({ values });

                                    const payload = getFormData(values);
                                    // console.debug({ payload });

                                    updateVendorProfileLogo(getFormData(values))
                                        .then(response => {
                                            // console.debug({ response });

                                            if (response && response.statusCode === 200) router.reload();
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }}
                                submitButtonShow={true}
                                submitButtonText="Logo Update"
                                enableReinitialize={false}
                            />
                            <div className="mt-3" />
                            <GenericFormGenerator
                                fields={[
                                    {
                                        type: 'file-select',
                                        name: 'licenseImageUrl',
                                        placeholder: 'Select license image file!',
                                        title: 'To update license image, please choose a file from the option below and press update',
                                        initialValue: null,
                                        acceptType: 'image/*',
                                        maxFileSize: 1048576,
                                        validate: (values: any) => {
                                            if (!values.licenseImageUrl) return 'Required!';

                                            return null;
                                        },
                                    },
                                ]}
                                callback={values => {
                                    // console.debug({ values });

                                    const payload = getFormData(values);
                                    // console.debug({ payload });

                                    updateVendorProfileLicense(getFormData(values))
                                        .then(response => {
                                            // console.debug({ response });

                                            if (response && response.statusCode === 200) router.reload();
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }}
                                submitButtonShow={true}
                                submitButtonText="License Update"
                                enableReinitialize={false}
                            />
                            <div className="mt-3" />
                            <GenericFormGenerator
                                fields={[
                                    {
                                        type: 'file-select',
                                        name: 'responsiblePersonImageUrl',
                                        placeholder: 'Select responsible person image file!',
                                        title: 'To update responsible person image, please choose a file from the option below and press update',
                                        initialValue: null,
                                        acceptType: 'image/*',
                                        maxFileSize: 1048576,
                                        validate: (values: any) => {
                                            if (!values.responsiblePersonImageUrl) return 'Required!';

                                            return null;
                                        },
                                    },
                                ]}
                                callback={values => {
                                    // console.debug({ values });

                                    const payload = getFormData(values);
                                    // console.debug({ payload });

                                    updateVendorProfileRp(getFormData(values))
                                        .then(response => {
                                            // console.debug({ response });

                                            if (response && response.statusCode === 200) router.reload();
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }}
                                submitButtonShow={true}
                                submitButtonText="Responsible Person Image Update"
                                enableReinitialize={false}
                            />
                            <div className="mt-3" />
                            <GenericFormGenerator
                                fields={[
                                    {
                                        type: 'file-select',
                                        name: 'responsiblePersonNIDImageUrl',
                                        placeholder: 'Select responsible person NID image file!',
                                        title: 'To update responsible person NID image, please choose a file from the option below and press update',
                                        initialValue: null,
                                        acceptType: 'image/*',
                                        maxFileSize: 1048576,
                                        validate: (values: any) => {
                                            if (!values.responsiblePersonNIDImageUrl) return 'Required!';

                                            return null;
                                        },
                                    },
                                ]}
                                callback={values => {
                                    // console.debug({ values });

                                    const payload = getFormData(values);
                                    // console.debug({ payload });

                                    updateVendorProfileRpNid(getFormData(values))
                                        .then(response => {
                                            // console.debug({ response });

                                            if (response && response.statusCode === 200) router.reload();
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }}
                                submitButtonShow={true}
                                submitButtonText="Responsible Person NID Update"
                                enableReinitialize={false}
                            />
                        </Fieldset>
                    </div>
                    <div className="xl:col-5 lg:col-6 md:col-12 sm:col-12">
                        <Fieldset legend="License" className="mt-3">
                            <Image
                                src={vendor.licenseImageUrl ?? '/images/image-placeholder.png'}
                                alt=""
                                width="90"
                                preview
                            />
                        </Fieldset>
                        <Fieldset legend="Responsible Person" className="mt-3">
                            <Image
                                src={vendor.responsiblePersonImageUrl ?? '/images/image-placeholder.png'}
                                alt=""
                                width="90"
                                preview
                            />
                        </Fieldset>
                        <Fieldset legend="Responsible Person NID" className="mt-3">
                            <Image
                                src={vendor.responsiblePersonNIDImageUrl ?? '/images/image-placeholder.png'}
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

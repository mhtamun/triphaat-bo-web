/* eslint-disable @next/next/no-img-element */

import React, { useContext, useCallback, useRef } from 'react';

// application libraries
// import AppConfig from '../../../components/layout/AppConfig';
import { LayoutContext } from '../../../components/layout/context/layoutcontext';
import { Page } from '../../../types/types';
import { login } from '../../../apis/';
import { createLogin } from '../../../libs/auth';

// third party libraries
import { useRouter } from 'next/router';
import Head from 'next/head';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage: Page = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const formik = useFormik({
        enableReinitialize: false,

        initialValues: {
            email: '',
            password: '',
            checked: false,
        },

        validationSchema: Yup.object().shape({
            email: Yup.string().email('Please enter a valid email!').required('Please enter a valid email!'),
            password: Yup.string().required('Please enter a valid password!'),
        }),

        onSubmit: (values: FormikValues, { setSubmitting }) => {
            setSubmitting(true);

            login({ email: values.email, password: values.password, type: 'TRIPHAAT_ADMIN' })
                .then(response => {
                    if (!response) if (!response) throw { message: 'Server not working!' };

                    if (response.statusCode !== 200) throw { message: response.message };

                    const success = createLogin(
                        response.data.user,
                        response.data.access_type,
                        response.data.access_token
                    );

                    if (success) router.push('/');
                })
                .catch(error => {
                    console.error('error', error);
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <form
                        className="w-full surface-card py-8 px-5 sm:px-8"
                        style={{ borderRadius: '53px' }}
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, TripHaat Admin!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email address..."
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                autoComplete="email"
                                tabIndex={1}
                                className={`w-full md:w-30rem ${!formik.errors.email ? ' ' : 'p-invalid'}`}
                                style={{ padding: '1rem' }}
                            />
                            <p id={`email-help`} className="p-error mt-1 mb-3">
                                {formik.errors.email}
                            </p>
                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password..."
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                feedback={false}
                                tabIndex={2}
                                toggleMask
                                className={`w-full ${!formik.errors.password ? ' ' : 'p-invalid'}`}
                                inputClassName="w-full p-3 md:w-30rem"
                            ></Password>
                            <p id={`password-help`} className="p-error mt-1 mb-3">
                                {formik.errors.password}
                            </p>
                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox
                                        id="remember-me"
                                        onChange={e => formik.setFieldValue('checked', e.checked)}
                                        checked={formik.values.checked}
                                        className="mr-2"
                                    ></Checkbox>
                                    <label htmlFor="remember-me">Remember Me</label>
                                </div>
                                <a
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}
                                    onClick={() => {
                                        router.push('/v-p/reset-password');
                                    }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Button type="submit" className="w-full p-3 text-xl center">
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>{`Login | Admin Panel | triphaat.com`}</title>
            </Head>
            {page}
            {/* <AppConfig simple /> */}
        </>
    );
};

export default LoginPage;

/* eslint-disable @next/next/no-img-element */

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
// application libraries
import AppConfig from '../../../components/layout/AppConfig';
import { LayoutContext } from '../../../components/layout/context/layoutcontext';
import { Page } from '../../../types/types';
import { login } from '../../../api/auth';
import { createLogin } from '../../../libs/auth';
// third party libraries
import { useFormik } from 'formik';
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
            email: 'mhtamun@gmail.com',
            password: '123456',
            checked: false,
        },

        validationSchema: Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().required('Required'),
        }),

        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true);

            login({ email: values.email, password: values.password })
                .then((response) => {
                    if (!response) {
                        throw new Error('Invalid response!');
                    }

                    if (response.statusCode !== 200) {
                        throw new Error(response.message);
                    }

                    createLogin(response.data.user, response.data.access_type, response.data.access_token);

                    router.push('/');
                })
                .catch((error) => {
                    console.error(error);

                    // toast(
                    //     error instanceof Error
                    //         ? error.message
                    //         : typeof error == String
                    //         ? error
                    //         : 'Something went wrong!',
                    //     'error'
                    // );
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
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                            />
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
                                className="w-full mb-5"
                                inputClassName="w-full p-3 md:w-30rem"
                            ></Password>
                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox
                                        id="remember-me"
                                        onChange={(e) => formik.setFieldValue('checked', e.checked)}
                                        checked={formik.values.checked}
                                        className="mr-2"
                                    ></Checkbox>
                                    <label htmlFor="remember-me">Remember Me</label>
                                </div>
                                <a
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}
                                    onClick={() => {
                                        router.push('/reset-password');
                                    }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Button type="submit" label="Sign In" className="w-full p-3 text-xl"></Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default LoginPage;

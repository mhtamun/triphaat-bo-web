import { toast, Zoom, TypeOptions, ToastOptions, ToastContent } from 'react-toastify';
import { IData } from '../libs/api';

const toastOptions: ToastOptions = {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: 'colored',
    transition: Zoom,
};

export const showToast = (message: ToastContent, type: TypeOptions, options?: ToastOptions) => {
    toast(message, { ...toastOptions, ...options, type });
};

export const showApiCallLoaderToast = (
    promise: Promise<IData>,
    pendingMessage: string,
    type: TypeOptions,
    options?: ToastOptions
): Promise<IData> => {
    const toastId = Math.floor(Math.random() * (9999 - 9 + 1)) + 9;
    toast.loading(pendingMessage, { ...toastOptions, ...options, autoClose: false, isLoading: true, type, toastId });

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            promise
                .then(response => {
                    if (response.statusCode !== 200)
                        toast(response.message, {
                            ...toastOptions,
                            ...options,
                            autoClose: 5000,
                            isLoading: false,
                            type: toast.TYPE.ERROR,
                        });

                    resolve(response);
                })
                .catch(error => {
                    toast('Something went wrong!', {
                        ...toastOptions,
                        ...options,
                        autoClose: 1000,
                        isLoading: false,
                        type: toast.TYPE.ERROR,
                    });

                    reject(error);
                })
                .finally(() => {
                    toast.dismiss(toastId);
                });
        }, 500);
    });
};

export const showPromisifyToast = (
    promise: Promise<any>,
    messages: {
        pending: string;
        success: string;
        error: string;
    },
    type: TypeOptions,
    options?: ToastOptions
) => {
    return toast.promise(promise, messages, { ...toastOptions, ...options, type });
};

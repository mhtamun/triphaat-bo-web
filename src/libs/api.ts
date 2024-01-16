import axios, { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from './cookie';
import { apiBaseUrl as baseURL } from '../config/env';
import { showApiCallLoaderToast } from '../utils/toast';

const instance = axios.create({
    baseURL,
    timeout: 300000,
    validateStatus: status => status === 200,
});

instance.defaults.onDownloadProgress = progressEvent => {
    // increment((progressEvent.loaded / progressEvent.total) * 100);
};

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        // console.debug('request -> config', config);

        return config;
    },
    function (error) {
        // Do something with request error

        console.error('request -> error', error);

        return Promise.reject(error);
    }
);

export interface IData {
    statusCode: number;
    message: string;
    data?: any;
    error?: any;
}

instance.interceptors.response.use(
    function (response: AxiosResponse): AxiosResponse<IData> {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        // console.debug('response -> data', response.data);

        return response.data;
    },
    function (error: AxiosError<AxiosResponse>): AxiosResponse<IData> | null {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (!error) return null;

        if (!error.response) return null;

        if (!error.response.data) return null;

        console.error('response -> data', error.response.data);

        return error.response.data;
    }
);

const getHeaders = (authorization?: string | null, contentType?: string | null) => {
    // console.debug({ authorization, contentType });

    return {
        'Content-Type': !contentType ? 'application/json' : contentType,
        Authorization: !authorization
            ? !getCookie('accessType') || !getCookie('accessToken')
                ? undefined
                : `${getCookie('accessType')} ${getCookie('accessToken')}`
            : authorization,
    };
};

export const callPostApi = (
    url: string,
    payload: any,
    authorization?: string | null,
    contentType?: string | null,
    showLoader?: boolean
): Promise<IData> => {
    // console.debug({ url, payload, headers: getHeaders(authorization, contentType) });

    const promise: Promise<IData> = instance.post(url, payload, {
        headers: getHeaders(authorization, contentType),
    });

    if (!showLoader) return promise;

    return showApiCallLoaderToast(promise, 'Posting data, please wait!', 'info');
};

export const callGetApi = (url: string, authorization?: string | null, showLoader?: boolean): Promise<IData> => {
    const promise: Promise<IData> = instance.get(url, {
        headers: getHeaders(authorization),
    });

    if (!showLoader) return promise;

    return showApiCallLoaderToast(promise, 'Fetching data, please wait!', 'info');
};

export const callPutApi = (
    url: string,
    payload: any,
    authorization?: string | null,
    contentType?: string | null,
    showLoader?: boolean
): Promise<IData> => {
    const promise: Promise<IData> = instance.put(url, payload, {
        headers: getHeaders(authorization, contentType),
    });

    if (!showLoader) return promise;

    return showApiCallLoaderToast(promise, 'Updating data, please wait!', 'info');
};

export const callDeleteApi = (url: string, authorization?: string | null, showLoader?: boolean): Promise<IData> => {
    const promise: Promise<IData> = instance.delete(url, {
        headers: getHeaders(authorization),
    });

    if (!showLoader) return promise;

    return showApiCallLoaderToast(promise, 'Deleting, please wait!', 'info');
};

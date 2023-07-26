import axios, { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from './cookie';
import { apiBaseUrl as baseURL } from '../config/env';

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

        console.debug('request', config);

        return config;
    },
    function (error) {
        // Do something with request error

        console.error('error', error);

        return Promise.reject(error);
    }
);

interface IData {
    statusCode: number;
    message: string;
    data?: any;
    error?: any;
}

instance.interceptors.response.use(
    function (response: AxiosResponse): AxiosResponse<IData> {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        console.debug('response', response);

        return response.data;
    },
    function (error: AxiosError): AxiosResponse<IData | null> | null | {} {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (!error) return null;

        if (!error.response) return null;

        if (!error.response.data) return null;

        console.error('response', error.response);

        return error.response.data;
    }
);

const getHeaders = (authorization?: string | null, contentType?: string | null) => {
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
    contentType?: string | null
): Promise<IData> =>
    instance.post(url, payload, {
        headers: getHeaders(authorization, contentType),
    });

export const callGetApi = (url: string, authorization?: string | null): Promise<IData> =>
    instance.get(url, {
        headers: getHeaders(authorization),
    });

export const callPutApi = (
    url: string,
    payload: any,
    authorization?: string | null,
    contentType?: string
): Promise<IData> =>
    instance.put(url, payload, {
        headers: getHeaders(authorization, contentType),
    });

export const callDeleteApi = (url: string, authorization?: string | null): Promise<IData> =>
    instance.delete(url, {
        headers: getHeaders(authorization),
    });

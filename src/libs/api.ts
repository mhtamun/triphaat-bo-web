import axios, { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from './cookie';
import { apiBaseUrl } from '../config/env';

const instance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 300000,
    validateStatus: (status) => status === 200,
});

instance.defaults.onDownloadProgress = (progressEvent) => {
    // increment((progressEvent.loaded / progressEvent.total) * 100);
};

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        // console.debug('request', config);

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

const getHeaders = (contentType?: string | null) => {
    return {
        'Content-Type': !contentType ? 'application/json' : contentType,
        Authorization: `Bearer ${getCookie('accessToken')}`,
    };
};

export const callPostApi = (url: string, payload: any, contentType?: string): Promise<IData> =>
    instance.post(url, payload, {
        headers: getHeaders(contentType),
    });

export const callGetApi = (url: string): Promise<IData> =>
    instance.get(url, {
        headers: getHeaders(),
    });

export const callPutApi = (url: string, payload: any, contentType?: string): Promise<IData> =>
    instance.put(url, payload, {
        headers: getHeaders(contentType),
    });

export const callDeleteApi = (url: string): Promise<IData> =>
    instance.delete(url, {
        headers: getHeaders(),
    });

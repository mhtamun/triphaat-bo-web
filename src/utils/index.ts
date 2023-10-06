import * as _ from 'lodash';

export const getUserStatusOptions = () => [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'BLOCKED', label: 'BLOCKED' },
];

export const getGeneralStatusOptions = () => [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

export const getVendorStatusOptions = () => [
    { value: 'PERMITTED', label: 'Permitted' },
    { value: 'BANNED', label: 'Banned' },
];

export const getMonths = () => [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
];

export const getGenderOptions = () => [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];

export const getPaymentStatusOptions = () => [
    { value: 'PENDING', label: 'PENDING' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'CANCELED', label: 'CANCELED' },
    { value: 'REFUNDED', label: 'REFUNDED' },
];

export const getBookingStatusOptions = () => [
    { value: 'PENDING', label: 'PENDING' },
    { value: 'LOCKED', label: 'LOCKED' },
    { value: 'RESERVED', label: 'RESERVED' },
    { value: 'CONFIRMED', label: 'CONFIRMED' },
    { value: 'CANCELED', label: 'CANCELED' },
    { value: 'EXPIRED', label: 'EXPIRED' },
];

export const getFormData = (payload: any) => {
    const formData = new FormData();

    for (let key in payload) {
        // console.debug(key, payload[key], payload[key].name);

        if (_.isUndefined(payload[key]) || _.isNull(payload[key])) continue;

        if (payload[key] instanceof File) {
            formData.append(key, payload[key], payload[key].name);
        } else {
            formData.append(key, payload[key]);
        }
    }

    // console.debug('formData', formData);

    return formData;
};

export const getSeverity = (key: string) => {
    switch (key) {
        case 'ACTIVE':
        case 'CONFIRMED':
        case 'COMPLETED':
            return 'success';

        case 'INACTIVE':
        case 'EXPIRED':
        case 'CANCELED':
        case 'BLOCKED':
            return 'danger';

        case 'PENDING':
        case 'LOCKED':
        case 'REFUNDED':
            return 'warning';

        default:
            return null;
    }
};

export const generateQueryPath = (
    pathname: string,
    pathParams?: any | {} | null,
    queryParams?: any | {} | null
): string => {
    // console.debug({ pathname, pathParams, queryParams });

    let path: string = pathname;

    if (
        !_.isEmpty(pathname) &&
        _.includes(pathname, '[') &&
        _.includes(pathname, ']') &&
        !_.isUndefined(pathParams) &&
        !_.isNull(pathParams) &&
        !_.isEmpty(pathParams)
    ) {
        path = _.reduce(
            pathParams,
            (result, value, key) => {
                // console.debug({ result, value, key });

                return _.replace(result, `[${key}]`, value);
            },
            pathname
        );
    }

    return _.reduce(
        queryParams,
        (result, value, key) => {
            // console.debug({ result, value, key });

            // If query param property is same as path param
            if (
                !_.isUndefined(pathParams) &&
                !_.isNull(pathParams) &&
                !_.isEmpty(pathParams) &&
                Boolean(pathParams[key])
            )
                return result;

            return `${result}${result === path ? '?' : '&'}${key}=${value}`;
        },
        path
    );
};

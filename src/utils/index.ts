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

export const getExpenseCategoryOptions = () => [
    {
        label: 'Office Supplies',
        value: 'Office Supplies',
        items: [
            { label: 'Office Supplies', value: 'Office Supplies' },
            { label: 'Pens, Pencils, and Markers', value: 'Pens, Pencils, and Markers' },
            { label: 'Paper and Notebooks', value: 'Paper and Notebooks' },
            { label: 'Envelopes and Mailers', value: 'Envelopes and Mailers' },
            { label: 'Printer Ink and Toner', value: 'Printer Ink and Toner' },
            { label: 'Staplers and Staples', value: 'Staplers and Staples' },
            { label: 'Desk Accessories', value: 'Desk Accessories' },
        ],
    },
    {
        label: 'Technology and Electronics',
        value: 'Technology and Electronics',
        items: [
            { label: 'Technology and Electronics', value: 'Technology and Electronics' },
            { label: 'Computers and Laptops', value: 'Computers and Laptops' },
            { label: 'Monitors and Displays', value: 'Monitors and Displays' },
            { label: 'Printers and Scanners', value: 'Printers and Scanners' },
            { label: 'Software Licenses', value: 'Software Licenses' },
            { label: 'Networking Equipment', value: 'Networking Equipment' },
            { label: 'Mobile Phones and Accessories', value: 'Mobile Phones and Accessories' },
        ],
    },
    {
        label: 'Furniture and Fixtures',
        value: 'Furniture and Fixtures',
        items: [
            { label: 'Furniture and Fixtures', value: 'Furniture and Fixtures' },
            { label: 'Desks and Chairs', value: 'Desks and Chairs' },
            { label: 'File Cabinets', value: 'File Cabinets' },
            { label: 'Shelving Units', value: 'Shelving Units' },
            { label: 'Office Decor', value: 'Office Decor' },
            { label: 'Lighting Fixtures', value: 'Lighting Fixtures' },
        ],
    },
    {
        label: 'Rent and Leasing',
        value: 'Rent and Leasing',
        items: [
            { label: 'Rent and Leasing', value: 'Rent and Leasing' },
            { label: 'Office Space Rent', value: 'Office Space Rent' },
            { label: 'Equipment Leases', value: 'Equipment Leases' },
        ],
    },
    {
        label: 'Utilities',
        value: 'Utilities',
        items: [
            { label: 'Utilities', value: 'Utilities' },
            { label: 'Electricity', value: 'Electricity' },
            { label: 'Water', value: 'Water' },
            { label: 'Internet and Phone Service', value: 'Internet and Phone Service' },
        ],
    },
    {
        label: 'Business',
        value: 'Business',
        items: [
            { label: 'Business Travel', value: 'Business Travel' },
            { label: 'Flights and Accommodation', value: 'Flights and Accommodation' },
            { label: 'Meals and Entertainment', value: 'Meals and Entertainment' },
            { label: 'Transportation (Bus, Cars, ...)', value: 'Transportation (Bus, Cars, ...)' },
        ],
    },
    {
        label: 'Marketing and Advertising',
        value: 'Marketing and Advertising',
        items: [
            { label: 'Marketing and Advertising', value: 'Marketing and Advertising' },
            { label: 'Advertising Campaigns', value: 'Advertising Campaigns' },
            { label: 'Promotional Materials', value: 'Promotional Materials' },
            { label: 'Marketing Software and Tools', value: 'Marketing Software and Tools' },
        ],
    },
    {
        label: 'Employee Expenses',
        value: 'Employee Expenses',
        items: [
            { label: 'Employee Expenses', value: 'Employee Expenses' },
            { label: 'Salaries and Wages', value: 'Salaries and Wages' },
            { label: 'Employee Benefits', value: 'Employee Benefits' },
            { label: 'Employee Training', value: 'Employee Training' },
        ],
    },
];

export const getRevenueCategoryOptions = () => [
    { label: 'Service Revenue', value: 'Service Revenue' },
    { label: 'Product Sales', value: 'Product Sales' },
    { label: 'Interest Income', value: 'Interest Income' },
    { label: 'Investment Income', value: 'Investment Income' },
    { label: 'Other Revenue', value: 'Other Revenue' },
];

export const getPaymentMethodOptions = () => [
    { value: 'CASH', label: 'CASH' },
    { value: 'CREDIT_CARD', label: 'CREDIT CARD' },
    { value: 'DEBIT_CARD', label: 'DEBIT CARD' },
    { value: 'MFS', label: 'MFS' },
    { value: 'BANK_TRANSFER', label: 'BANK TRANSFER' },
    { value: 'OTHER', label: 'OTHER' },
];

export const getSeverity = (key: string) => {
    switch (key) {
        case 'ACTIVE':
        case 'CONFIRMED':
        case 'COMPLETED':
        case 'REVENUE':
            return 'success';

        case 'INACTIVE':
        case 'EXPIRED':
        case 'CANCELED':
        case 'BLOCKED':
        case 'EXPENSE':
            return 'danger';

        case 'PENDING':
        case 'LOCKED':
        case 'REFUNDED':
            return 'warning';

        default:
            return null;
    }
};

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

import * as _ from 'lodash';
import { NextRouter } from 'next/router';

export const getUserStatusOptions = () => [
    { value: 'PENDING', label: 'PENDING' },
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'BLOCKED', label: 'BLOCKED' },
    { value: 'DELETED', label: 'DELETED' },
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

export const getVariantOptions = () => [
    {
        label: 'Single Variant (No Reason)',
        value: 'Single Variant (No Reason)',
        items: [{ label: 'Not Applicable', value: 'n/a' }],
    },
    {
        label: 'Accommodation Type',
        value: 'Accommodation Type',
        items: [
            { label: 'Hotel', value: 'Hotel' },
            { label: 'Motel', value: 'Motel' },
            { label: 'Resort', value: 'Resort' },
            { label: 'Cottage', value: 'Cottage' },
            { label: 'Apartment', value: 'Apartment' },
            { label: 'Houseboat', value: 'Houseboat' },
        ],
    },
    {
        label: 'Accommodation Class',
        value: 'Accommodation Class',
        items: [
            { label: 'AC Accommodation', value: 'AC Accommodation' },
            { label: 'Non-AC Accommodation', value: 'Non-AC Accommodation' },
            { label: '2 Star', value: '2 Star' },
            { label: '3 Star', value: '3 Star' },
            { label: '4 Star', value: '4 Star' },
            { label: '5 Star', value: '5 Star' },
            { label: '7 Star', value: '7 Star' },
        ],
    },
    {
        label: 'Accommodation Sharing',
        value: 'Accommodation Sharing',
        items: [
            { label: 'Couple (2 person sharing)', value: 'Couple (2 person sharing)' },
            { label: '3 person sharing', value: '3 person sharing' },
            { label: '4 person sharing', value: '4 person sharing' },
            { label: '5 person sharing', value: '5 person sharing' },
            { label: '6 person sharing', value: '6 person sharing' },
            {
                label: 'No sharing (1 Person sharing)',
                value: 'No sharing (1 Person sharing)',
            },
        ],
    },
    {
        label: 'Transportation Type',
        value: 'Transportation Type',
        items: [
            { label: '2 Seater Vehicle', value: '2 Seater Vehicle' },
            { label: '4 Seater Sedan', value: '4 Seater Sedan' },
            { label: '4 Seater SUV (Jeep)', value: '4 Seater SUV (Jeep)' },
            { label: '4 Seater Premium Car', value: '4 Seater Premium Car' },
            { label: '7 Seater Car', value: '7 Seater Car' },
            { label: '10 Seater Microbus', value: '10 Seater Microbus' },
            { label: '30 Seater Minibus', value: '30 Seater Minibus' },
            { label: '27 Seater (Luxury) Bus', value: '27 Seater (Luxury) Bus' },
            { label: '36 Seater Bus', value: '36 Seater Bus' },
            { label: 'Airplane', value: 'Airplane' },
            { label: 'Speed Boat', value: 'Speed Boat' },
            { label: 'Ship', value: 'Ship' },
            { label: 'Cruise Ship', value: 'Cruise Ship' },
        ],
    },
    {
        label: 'Transportation Class',
        value: 'Transportation Class',
        items: [
            { label: 'AC Transportation', value: 'AC Transportation' },
            { label: 'Non-AC Transportation', value: 'Non-AC Transportation' },
            { label: 'First Class', value: 'First Class' },
            { label: 'Business Class', value: 'Business Class' },
            { label: 'Economy Class', value: 'Economy Class' },
        ],
    },
    {
        label: 'Transportation Sharing',
        value: 'Transportation Sharing',
        items: [
            { label: 'Couple (2 person sharing)', value: 'Couple (2 person sharing)' },
            { label: '3 person sharing', value: '3 person sharing' },
            { label: '4 person sharing', value: '4 person sharing' },
            { label: '5 person sharing', value: '5 person sharing' },
            { label: '6 person sharing', value: '6 person sharing' },
            {
                label: 'No sharing (1 Person sharing)',
                value: 'No sharing (1 Person sharing)',
            },
        ],
    },
    {
        label: 'Food Type',
        value: 'Food Type',
        items: [
            { label: 'Vegetarian and Vegan', value: 'Vegetarian and Vegan' },
            { label: 'Gluten-Free', value: 'Gluten-Free' },
            { label: 'Kosher', value: 'Kosher' },
            { label: 'Halal', value: 'Halal' },
            { label: 'Low-Calorie or Healthy Choices', value: 'Low-Calorie or Healthy Choices' },
            { label: 'International Cuisine', value: 'International Cuisine' },
            { label: "Kids' Meals", value: "Kids' Meals" },
            { label: 'Gourmet or Fine Dining', value: 'Gourmet or Fine Dining' },
            { label: 'Fast Food and Snacks', value: 'Fast Food and Snacks' },
            { label: 'Local and Regional Specialties', value: 'Local and Regional Specialties' },
        ],
    },
    {
        label: 'Food Class',
        value: 'Food Class',
        items: [],
    },
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

    for (const key in payload) {
        // console.debug(key, payload[key], payload[key].name);

        if (_.isUndefined(payload[key]) || _.isNull(payload[key])) continue;

        if (payload[key] instanceof File) {
            formData.append(key, payload[key], payload[key].name);
        } else {
            formData.append(key, payload[key]);
        }
    }

    return formData;
};

export const generateQueryPath = (pathname: string, pathParams?: any | null, queryParams?: any | null): string => {
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

export interface ITripType {
    dateType: string;
    accommodationType: string;
    transportationType: string;
    foodType: string;
}

export const getTripType = (router: NextRouter): ITripType => {
    const types = {} as ITripType;

    if (router.query.type === '0000') {
        types.dateType = 'FIXED';
        types.accommodationType = 'FIXED';
        types.transportationType = 'FIXED';
        types.foodType = 'FIXED';
    } else if (router.query.type === '2260') {
        types.dateType = 'ON_DEMAND_SINGLE';
        types.accommodationType = 'ON_DEMAND_ROOM_SEAT';
        types.transportationType = 'SELF_MANAGED';
        types.foodType = 'FIXED';
    } else if (router.query.type === '1111') {
        types.dateType = 'UNFIXED';
        types.accommodationType = 'UNFIXED';
        types.transportationType = 'UNFIXED';
        types.foodType = 'UNFIXED';
    }

    return types;
};

export const isJSONString = (string: string) => {
    try {
        JSON.parse(string);
        return true;
    } catch (error) {
        return false;
    }
};

export const getTripGeneralTypeOptions = [
    { label: 'Holiday Package', value: 'HOLIDAY_PACKAGE' },
    { label: 'Umrah Package', value: 'UMRAH_PACKAGE' },
    { label: 'Group Tour', value: 'GROUP_TOUR' },
    { label: 'Visa', value: 'VISA' },
    { label: 'Houseboat', value: 'HOUSEBOAT' },
    { label: 'Other', value: 'OTHER' },
];

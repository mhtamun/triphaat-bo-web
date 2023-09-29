import { callPostApi, callGetApi, IData, callPutApi } from '../libs/api';
import { apiBaseUrl } from '../config/env';

// TRIPHAAT admin APIs

export const login = (payload: { email: string; password: string; type: string }) =>
    callPostApi(apiBaseUrl + '/api/v1/auth/sign-in', payload, null, null, true);

export const resetPassword = () => {};

export const getModuleNames = () => callGetApi(apiBaseUrl + '/api/v1/permission-modules');

export const getPermissionTypes = () => callGetApi(apiBaseUrl + '/api/v1/permission-types');

export const getRoles = () => callGetApi(apiBaseUrl + '/api/v1/roles');

export const getFolderById = (folderId: number) => callGetApi(apiBaseUrl + '/api/v1/folders/' + folderId);

// export const getVendors = (authorization: string) => callGetApi(apiBaseUrl + '/api/v1/vendors', authorization);

// export const getLocations = (authorization: string) => callGetApi(apiBaseUrl + '/api/v1/locations', authorization);

// export const getCountries = (authorization: string) => callGetApi(apiBaseUrl + '/api/v1/countries', authorization);

export const getCountryById = (id: string, authorization: string) =>
    callGetApi(apiBaseUrl + '/api/v1/countries/' + id, authorization);

export const getStateById = (id: string, authorization: string) =>
    callGetApi(apiBaseUrl + '/api/v1/states/' + id, authorization);

export const getCityById = (id: string, authorization: string) =>
    callGetApi(apiBaseUrl + '/api/v1/cities/' + id, authorization);

// VENDOR admin APIs

export const vendorLogin = (payload: { email: string; password: string; type: string }) =>
    callPostApi(apiBaseUrl + '/vendor/api/v1/auth/sign-in', payload, null, null, true);

export const getTripForVendor = (id: string, authorization: string) =>
    callGetApi(apiBaseUrl + '/vendor/api/v1/trips/' + id, authorization);

export const getTotalCountNumberOfTripsForVendor = (authorization: string) =>
    callGetApi(apiBaseUrl + '/vendor/api/v1/trips-count-total', authorization);

export const getTotalBalancePaymentOfTripsForVendor = (authorization: string) =>
    callGetApi(apiBaseUrl + '/vendor/api/v1/trip-payments-balance-total', authorization);

export const getCurrentMonthBalancePaymentOfTripsForVendor = (authorization: string) =>
    callGetApi(apiBaseUrl + '/vendor/api/v1/trip-payments-balance-current-month', authorization);

export const initBooking = (payload: {
    tripId: number;
    variantId: number;
    pricePerPerson: number;
    numberOfTraveler: number;
}) => callPostApi('/vendor/api/v1/init-trip-booking', payload, null, null, true);

export const submitBooking = (payload: {
    jobId: number;
    bookingId: number;
    customerId?: number;
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}) => callPostApi('/vendor/api/v1/submit-trip-booking', payload, null, null, true);

export const searchCustomersForVendor = (key: string) =>
    callGetApi('/vendor/api/v1/search/customers?key=' + key, null, true);

export const getTripBookingPaymentForVendor = (tripId: string, tripBookingPaymentId: string, authorization?: string) =>
    callGetApi(`/vendor/api/v1/trips/${tripId}/trip-booking-payments/${tripBookingPaymentId}`, authorization, false);

export const postManualTripBookingConfirm = (tripId: string, tripBookingPaymentId: string) =>
    callPutApi(
        `/vendor/api/v1/trips/${tripId}/trip-booking-payments/${tripBookingPaymentId}/manual-confirmation`,
        {},
        null,
        null,
        true
    );

export const postManualTripBookingCancel = (tripId: string, tripBookingPaymentId: string) =>
    callPutApi(
        `/vendor/api/v1/trips/${tripId}/trip-booking-payments/${tripBookingPaymentId}/manual-cancelation`,
        {},
        null,
        null,
        true
    );

// general APIs

export const getLocations = (authorization: string) => callGetApi(apiBaseUrl + '/api/v1/locations', authorization);

export const getTripVariants = (id: string, authorization: string) =>
    callGetApi(apiBaseUrl + '/api/v1/trips/' + id + '/variants', authorization);

// public APIs

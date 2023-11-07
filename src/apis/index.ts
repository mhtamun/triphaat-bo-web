import { callPostApi, callGetApi, callPutApi, callDeleteApi } from '../libs/api';
import { apiBaseUrl } from '../config/env';

// TRIPHAAT admin APIs

export const login = (payload: { email: string; password: string; type: string }) =>
    callPostApi(apiBaseUrl + '/api/v1/auth/sign-in', payload, null, null, true);

export const resetPassword = () => {};

export const getModuleNames = () => callGetApi(apiBaseUrl + '/api/v1/permission-modules');

export const getPermissionTypes = () => callGetApi(apiBaseUrl + '/api/v1/permission-types');

export const getRoles = () => callGetApi(apiBaseUrl + '/api/v1/roles');

export const getFolderById = (folderId: number) => callGetApi(apiBaseUrl + '/api/v1/folders/' + folderId);

export const getVendorById = (vendorId: string, authorization: string) =>
    callGetApi(apiBaseUrl + '/api/v1/vendors/' + vendorId, authorization);

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
    numberOfTravelers: number;
    serviceDateId?: number | null;
    roomSeats?:
        | {
              roomId: number;
              seatId: number;
          }[]
        | null;
}) => callPostApi('/vendor/api/v1/init-trip-booking', payload, null, null, true);

export const lockBooking = (payload: {
    jobId: number;
    bookingId: number;
    customerId?: number;
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}) => callPostApi('/vendor/api/v1/lock-trip-booking', payload, null, null, true);

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

export const sendInvoiceViaEmail = (tripId: string, tripBookingPaymentId: string) =>
    callGetApi(
        `/vendor/api/v1/trips/${tripId}/trip-booking-payments/${tripBookingPaymentId}/send-invoice-email`,
        null,
        true
    );

export const reserveBooking = (payload: { bookingId: number }) =>
    callPostApi('/vendor/api/v1/reserve-trip-booking', payload, null, null, true);

export const getTripBookingFacts = (tripId: string, authorization?: string) =>
    callGetApi(`/vendor/api/v1/trips/${tripId}/trip-booking-facts`, authorization);

export const getVendorProfile = (authorization?: string) => callGetApi(`/vendor/api/v1/vendor-profile`, authorization);

export const updateVendorProfile = (payload: any, authorization?: string) =>
    callPutApi(`/vendor/api/v1/vendor-profile`, payload, null, null, true);
export const updateVendorProfileLogo = (payload: any, authorization?: string) =>
    callPutApi(`/vendor/api/v1/vendor-profile-logo`, payload, null, 'multipart/form-data', true);
export const updateVendorProfileLicense = (payload: any, authorization?: string) =>
    callPutApi(`/vendor/api/v1/vendor-profile-license`, payload, null, 'multipart/form-data', true);
export const updateVendorProfileRp = (payload: any, authorization?: string) =>
    callPutApi(`/vendor/api/v1/vendor-profile-rp`, payload, null, 'multipart/form-data', true);
export const updateVendorProfileRpNid = (payload: any, authorization?: string) =>
    callPutApi(`/vendor/api/v1/vendor-profile-rp-nid`, payload, null, 'multipart/form-data', true);

// general APIs

export const getLocations = (authorization: string) => callGetApi(apiBaseUrl + '/api/v1/locations', authorization);

export const getTripVariants = (id: string, authorization: string) =>
    callGetApi(apiBaseUrl + '/api/v1/trips/' + id + '/variants', authorization);

export const postServiceDates = (payload: { tripId: number; dates: string[] }, authorization?: string) =>
    callPostApi('api/v1/service-dates', payload, authorization, null, true);

export const getServiceDates = (tripId: string, authorization?: string) =>
    callGetApi(`api/v1/trips/${tripId}/service-dates`, authorization);

export const deleteServiceDate = (id: string, authorization?: string) =>
    callDeleteApi('api/v1/service-dates/' + id, authorization, true);

export const addRoom = (
    payload: {
        tripId: number;
        identifier: string;
        type: string;
        description: string;
        maxOccupancy: number;
        numberOfSeats: number;
    },
    authorization?: string
) => callPostApi('api/v1/rooms', payload, authorization, null, true);

export const getRooms = (tripId: string, authorization?: string) =>
    callGetApi(`api/v1/trips/${tripId}/rooms`, authorization, true);

export const removeRoom = (id: string, authorization?: string) =>
    callDeleteApi('api/v1/rooms/' + id, authorization, true);

export const getProfile = (authorization: string) => callGetApi(apiBaseUrl + `/api/v1/user-profile`, authorization);

// public APIs

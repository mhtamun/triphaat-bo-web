import { callPostApi, callGetApi } from '../libs/api';
import { apiBaseUrl } from '../config/env';

export const login = (payload: { email: string; password: string; type: string }) =>
    callPostApi(apiBaseUrl + '/api/v1/auth/sign-in', payload);

export const resetPassword = () => {};

export const getModuleNames = () => callGetApi(apiBaseUrl + '/api/v1/permission-modules');

export const getPermissionTypes = () => callGetApi(apiBaseUrl + '/api/v1/permission-types');

export const getRoles = () => callGetApi(apiBaseUrl + '/api/v1/roles');

export const getVendors = () => callGetApi(apiBaseUrl + '/api/v1/vendors');

export const getLocations = () => callGetApi(apiBaseUrl + '/api/v1/locations');

export const getTrip = (id: string) => callGetApi(apiBaseUrl + '/api/v1/trips/' + id);

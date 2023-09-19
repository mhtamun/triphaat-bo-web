import * as _ from 'lodash';

export const getGeneralStatusOptions = () => [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

export const getGenderOptions = () => [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
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

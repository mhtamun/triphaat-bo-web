import _ from 'lodash';

// Regex
export const passwordRegex = /^[\w\d\W]{6,32}$/;

export const colors = {
    success: 'success',
    primary: 'primary',
    info: 'info',
    warning: 'warning',
    danger: 'danger',
};

export const getGenericBadgeColorText = (text: any) => {
    switch (_.lowerCase(text)) {
        // Status type 1
        case 'active':
            return colors.success;

        case 'in-active':
            return colors.danger;

        // Status type 2
        case 'approved':
            return colors.success;

        case 'pending':
            return colors.warning;

        case 'banned':
            return colors.danger;

        case 'canceled':
            return colors.danger;

        // Status type event
        case 'due':
            return colors.warning;

        case 'photo due':
            return colors.warning;

        case 'video due':
            return colors.warning;

        case 'done':
            return colors.primary;

        case 'delivered':
            return colors.success;

        // Priority type
        case 'high':
            return colors.danger;

        case 'medium':
            return colors.warning;

        case 'low':
            return colors.info;

        // Extra type
        // todo: For extra type badge colors

        default:
            return colors.primary;
    }
};

export const getRoleOptions = () => [
    { value: 'super-admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'operator', label: 'Operator' },
];

export const getFileTypeOptions = () => [
    { value: 'unspecified', label: 'Others' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'document', label: 'Document' },
    { value: 'gif', label: 'GIF' },
];

export const getBloodGroupOptions = () => [
    { value: 'A+', label: 'A+ (Positive)' },
    { value: 'A-', label: 'A- (Negative)' },
    { value: 'B+', label: 'B+ (Positive)' },
    { value: 'B-', label: 'B- (Negative)' },
    { value: 'O+', label: 'O+ (Positive)' },
    { value: 'O-', label: 'O- (Negative)' },
    { value: 'AB+', label: 'AB+ (Positive)' },
    { value: 'AB-', label: 'AB- (Negative)' },
];

export const getMemberTypeOptions = () => [
    { value: 'Photographer', label: 'Photographer' },
    { value: 'Photo Editor', label: 'Photo Editor' },
    { value: 'Cinematographer', label: 'Cinematographer' },
    { value: 'Cinema Editor', label: 'Cinema Editor' },
    { value: 'Other', label: 'Other' },
];

export const getSalaryTypeOptions = () => [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' },
    { value: 'Pay Per Work', label: 'Pay Per Work' },
    { value: 'Other', label: 'Other' },
];

export const getStatusOptions = () => [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export const getGenderOptions = () => [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];

export const getEventSlotOptions = () => [
    { value: 'morning - noon', label: 'Morning (09:00am - 12;00pm)' },
    { value: 'noon - evening', label: 'Day (01:00pm - 06:00pm)' },
    { value: 'evening - night', label: 'Night (07:00pm - 12:00am)' },
];

export const getEventStatusOptions = () => [
    { value: 'due', label: 'Due' },
    { value: 'photo due', label: 'Photo Due' },
    { value: 'video due', label: 'Video Due' },
    { value: 'done', label: 'Done' },
    { value: 'delivered', label: 'Delivered' },
];

export const getBookingStatusOptions = () => [
    { value: 'pending', label: 'Pending' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const getEventMemberPaymentStatusOptions = () => [
    { value: 'due', label: 'Due' },
    { value: 'paid', label: 'Paid' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const getEventMemberWorkStatusOptions = () => [
    { value: 'pending', label: 'Pending' },
    { value: 'photo raw done', label: 'Photo Raw Done' },
    { value: 'conversion done', label: 'Conversion Done' },
    { value: 'photo done', label: 'Photo Done' },
    { value: 'video raw done', label: 'Video Raw Done' },
    { value: 'trailer done', label: 'Trailer Done' },
    { value: 'video done', label: 'Video Done' },
    { value: 'completed', label: 'Completed' },
];

export const getFormData = (payload: any) => {
    const formData = new FormData();

    for (let key in payload) {
        // console.debug(key, payload[key], payload[key].name);

        if (_.isUndefined(payload[key]) || _.isNull(payload[key])) continue;

        if (payload[key] instanceof File) {
            formData.append(key, payload[key], payload[key].name, payload[key].type, payload[key].size);
        } else {
            formData.append(key, payload[key]);
        }
    }

    // console.debug('formData', formData);

    return formData;
};

// export const getBadge = (status) => {
//     switch (status) {
//         case 'active':
//             return 'success';
//         case 'confirmed':
//             return 'success';
//         case 'inactive':
//             return 'secondary';
//         case 'pending':
//             return 'warning';
//         case 'banned':
//             return 'danger';
//         case 'canceled':
//             return 'danger';
//         default:
//             return 'primary';
//     }
// };

// export const getStatusValues = () => [
//     { value: 'active', label: 'Active' },
//     { value: 'inactive', label: 'Inactive' },
// ];

// export const getCustomerStatusOptions = () => [
//     { value: 'pending', label: 'Pending' },
//     { value: 'active', label: 'Active' },
//     { value: 'banned', label: 'Banned' },
// ];

// export const pad = (num, size) => {
//     num = num.toString();
//     while (num.length < size) num = '0' + num;
//     return num;
// };

// export const showErrorMessagesInToaster = (message) => {
//   toast.error(message, {
//     position: 'top-right',
//     theme: 'colored',
//     autoClose: 5000,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     hideProgressBar: true,
//   });
// };

// export const showSuccessMessagesInToaster = (message) => {
//   toast.success(message, {
//     position: 'top-right',
//     theme: 'colored',
//     autoClose: 5000,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     hideProgressBar: true,
//   });
// };

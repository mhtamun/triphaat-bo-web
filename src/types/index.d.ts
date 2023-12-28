export interface IVendor {
    id: number;
    businessName: string;
    businessAddress: string;
    phone: string;
    email: string;
    logoImageUrl: string;
    licenseImageUrl: string;
    responsiblePersonImageUrl: string;
    responsiblePersonNIDImageUrl: string;
    responsiblePersonDesignation: string;
    responsiblePersonName: string;
    responsiblePersonEmail: string;
    responsiblePersonPhone: string;
    responsiblePersonNid: string;
    paymentType: string;
    bankAccountNumber: string;
    bankAccountName: string;
    bankName: string;
    bankBranchDistrictName: string;
    bankBranchName: string;
    bankBranchRoutingNumber: string;
    cardNumber: string;
    cardAccountName: string;
    cardBankName: string;
    checkPayToName: string;
    mfsName: string;
    mfsNumber: string;
    otherPayNote: string;
    manualBookingCommission: string;
    onlyPgwUseCommission: string;
    websiteBookingOnCommission: string;
    websiteBookingOffCommission: string;
    onSeasonMonths: string[];
    offSeasonMonths: string[];
    status: 'PERMITTED';
    bannedReason: string;
}

export interface ICustomer {
    id: number;
    name: string;
    countryCode: string;
    phoneNumber: string;
    email: string;
    profileImageUrl: string;
    status: string;
}

export interface ILocation {
    id: number;
    name: string;
    city?: {
        name: string;
        state?: {
            name: string;
            country?: {
                name: string;
            };
        };
    };
}

export interface ICity {
    id: number;
    name: string;
    state?: {
        name: string;
        country?: {
            name: string;
        };
    };
}

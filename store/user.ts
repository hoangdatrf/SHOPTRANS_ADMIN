import { defineStore } from "pinia";
import { useAxios } from "~/composables/axios";


export interface User {
    id?: string;
    username?: string | null;
    email?: string | null;
    fullName?: string | null;
    phone?: string | null;
    mobile?: string | null;
    company?: string | null;
    taxId?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null;
    defaultCurrency?: string | null;
    timezone?: string | null;
    role?: 'ADMIN' | 'USER' | string | null;
    isActive?: boolean;
    lastLoginAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    PER_CODE: string;
    PER_DESC: string;
    PER_CLASS: string | null;
    PER_MRC: string;
    PER_TRADE: string;
    PER_NOTUSED: string;
    PER_CAPACITY: string | null;
    PER_ORG: string;
    PER_CLASS_ORG: string | null;
    PER_EMAILADDRESS: string;
    PER_NOTIFICATIONPREF: string | null;
    PER_USER: string | null;
    PER_CREATED: string;
    PER_CREATEDBY: string;
    PER_UPDATED: string;
    PER_UPDATEDBY: string;
    PER_UPDATECOUNT: number;
    PER_SQLIDENTITY: number;
    PER_FLEETCUSTOMER: string | null;
    PER_FLEETCUSTOMER_ORG: string | null;
    PER_COSTCODE: string | null;
    PER_DRIVERSLICENSE: string | null;
    PER_PHONE: string | null;
    PER_PARENT: string | null;
    PER_SCHEDULINGSESSIONID: string | null;
    PER_SCHEDULINGTYPE: string | null;
    PER_CUSTOMER: string | null;
    PER_CUSTOMER_ORG: string | null;
    PER_ALIAS: string | null;
    PER_OBJECT: string;
    PER_OBJECT_ORG: string;
    PER_UDFCHAR01: string;
    PER_UDFCHAR02: string;
    PER_UDFCHAR03: string | null;
    PER_UDFCHAR04: string | null;
    PER_UDFCHAR05: string | null;
    PER_UDFCHAR06: string | null;
    PER_UDFCHAR07: string | null;
    PER_UDFCHAR08: string | null;
    PER_UDFCHAR09: string | null;
    PER_UDFCHAR10: string | null;
    PER_UDFCHAR11: string | null;
    PER_UDFCHAR12: string | null;
    PER_UDFCHAR13: string | null;
    PER_UDFCHAR14: string | null;
    PER_UDFCHAR15: string | null;
    PER_UDFCHAR16: string | null;
    PER_UDFCHAR17: string | null;
    PER_UDFCHAR18: string | null;
    PER_UDFCHAR19: string | null;
    PER_UDFCHAR20: string | null;
    PER_UDFCHAR21: string | null;
    PER_UDFCHAR22: string | null;
    PER_UDFCHAR23: string | null;
    PER_UDFCHAR24: string | null;
    PER_UDFCHAR25: string | null;
    PER_UDFCHAR26: string | null;
    PER_UDFCHAR27: string | null;
    PER_UDFCHAR28: string | null;
    PER_UDFCHAR29: string | null;
    PER_UDFCHAR30: string | null;
    PER_UDFNUM01: number | null;
    PER_UDFNUM02: number | null;
    PER_UDFNUM03: number | null;
    PER_UDFNUM04: number | null;
    PER_UDFNUM05: number | null;
    PER_UDFDATE01: string | null;
    PER_UDFDATE02: string | null;
    PER_UDFDATE03: string | null;
    PER_UDFDATE04: string | null;
    PER_UDFDATE05: string | null;
    PER_UDFCHKBOX01: string;
    PER_UDFCHKBOX02: string;
    PER_UDFCHKBOX03: string;
    PER_UDFCHKBOX04: string;
    PER_UDFCHKBOX05: string;
    PER_JOBTITLE: string;
    PER_SUPERVISOR: string | null;
    PER_HIREDATE: string | null;
    PER_BIRTHDATE: string;
    PER_TERMINATEDDATE: string | null;
    PER_PAYROLLNO: string | null;
    PER_SECURITYBADGENO: string | null;
    PER_ADDRESS: string | null;
    PER_CITY: string | null;
    PER_STATE: string | null;
    PER_ZIP: string | null;
    PER_COUNTRY: string | null;
    PER_EMERGENCYCONTACT: string | null;
    PER_EMERGENCYCONTACTPHNO: string | null;
    PER_MOBILEPHONENO: string | null;
    PER_HOMEPHONENO: string | null;
    PER_URL: string | null;
    PER_FAX: string | null;
    PER_INITIALS: string | null;
    PER_TRADESPERSON: string;
    PER_WORKSPACEOCCUPANT: string;
    PER_LASTSAVED: string;
    PER_PROFILEPICTURE: string | null;
    PER_DETERMINESCREWLOCATION: string;
    PER_STARTINGXCOORDINATE: number | null;
    PER_STARTINGYCOORDINATE: number | null;
}

export interface RegisterAccountPayload {
    username: string;
    email: string;
    firstName: string;
    surname: string;
    country: string;
    mobile: string;
    landline?: string;
    extension?: string;
    password: string;
    acceptTerms: boolean;
    acceptMarketing: boolean;
}

const getTokenFromResponse = (data: any) => {
    return data?.access_token || data?.accessToken || data?.token || data?.Token || data?.data?.access_token || data?.data?.token || null;
}

const getUserFromResponse = (data: any) => {
    if (data?.data?.user) return data.data.user;
    if (data?.data?.emp) return data.data.emp;
    if (data?.data?.profile) return data.data.profile;
    if (data?.data?.id || data?.data?.email || data?.data?.PER_CODE) return data.data;
    return data?.emp || data?.user || data?.profile || null;
}

const firstString = (...values: any[]) => {
    const value = values.find(item => typeof item === 'string' && item.trim());
    return value ? value.trim() : '';
}

const normalizeUser = (data: any, fallbackUsername = '') => {
    const username = data?.PER_CODE || data?.UserName || data?.Username || data?.username || data?.email || fallbackUsername;
    const displayName = data?.PER_DESC || data?.fullName || data?.Name || data?.FullName || [data?.FirstName, data?.LastName || data?.FamilyName].filter(Boolean).join(' ') || username || 'Account';
    const role = data?.role || data?.PER_CLASS || data?.Class || null;
    const company = firstString(
        data?.PER_ORG,
        data?.company,
        data?.Company,
        data?.companyName,
        data?.CompanyName,
        data?.ORG,
        data?.Org,
        data?.organization,
        data?.Organization,
        data?.orgName,
        data?.OrgName,
        data?.PER_OBJECT_ORG,
        data?.PER_CUSTOMER_ORG,
        data?.PER_FLEETCUSTOMER_ORG,
    );

    return {
        ...data,
        role,
        PER_CODE: String(username || ''),
        PER_DESC: String(displayName || ''),
        PER_USER: data?.PER_USER || username || null,
        PER_EMAILADDRESS: data?.PER_EMAILADDRESS || data?.Email || data?.email || '',
        PER_PHONE: data?.PER_PHONE || data?.phone || data?.Phone || data?.Mobile || data?.mobile || null,
        PER_MOBILEPHONENO: data?.PER_MOBILEPHONENO || data?.phone || data?.MobilePhoneNo || data?.Mobile || data?.mobile || null,
        PER_ORG: company,
        PER_CLASS: role,
        PER_JOBTITLE: data?.PER_JOBTITLE || data?.JobTitle || data?.ChucVu || '',
        PER_ADDRESS: data?.PER_ADDRESS || data?.Address || null,
        PER_COUNTRY: data?.PER_COUNTRY || data?.Country || null,
        mobile: data?.mobile || data?.PER_MOBILEPHONENO || data?.MobilePhoneNo || data?.Mobile || null,
        company: company || null,
        taxId: data?.taxId || data?.TaxId || data?.VAT || null,
        website: data?.website || data?.PER_URL || data?.Website || null,
        address: data?.address || data?.PER_ADDRESS || data?.Address || null,
        city: data?.city || data?.PER_CITY || data?.City || null,
        state: data?.state || data?.PER_STATE || data?.State || null,
        zip: data?.zip || data?.PER_ZIP || data?.Zip || null,
        country: data?.country || data?.PER_COUNTRY || data?.Country || null,
        defaultCurrency: data?.defaultCurrency || 'USD',
        timezone: data?.timezone || 'UTC+07 Bangkok, Hanoi',
    } as User;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null as string | null,
        user: {} as User,
        certificates: [] as any[],
    }),
    actions: {
        async login(username: string, password: string) {
            try {
                const axios = useAxios();
                const url = `/api/auth/login`;

                const response = await axios.post(url, { email: username, password });
                const token = getTokenFromResponse(response.data);

                if (!token) {
                    throw new Error('Login response did not include an access token.');
                }

                this.token = token;

                const userFromLogin = getUserFromResponse(response.data);
                if (userFromLogin) {
                    this.user = normalizeUser(userFromLogin, username);
                }

                try {
                    await this.refreshUserProfile(username);
                } catch (profileError) {
                    if (!this.user?.PER_CODE) {
                        this.user = normalizeUser({}, username);
                    }
                }
            } catch (error) {
                console.error("Failed to login:", error);
                this.token = null;
                this.user = {} as User;
                throw error;
            }
        },
        async logout() {
            this.token = null;
            this.user = {} as User;
        },
        async refreshUserProfile(username?: string) {
            const axios = useAxios();
            const userCode = username || this.user?.PER_CODE || this.user?.PER_USER || '';

            if (!userCode) {
                return this.user;
            }

            const encodedUserCode = encodeURIComponent(userCode);
            const encodedUpperUserCode = encodeURIComponent(userCode.toUpperCase());
            const requests = [
                () => axios.get(`/api/auth/profile`),
                () => axios.post(`/api/User/detailemp?empcode=${encodedUpperUserCode}`),
                () => axios.get(`/api/User/detailbyid?username=${encodedUserCode}`),
            ];

            let lastError: unknown = null;

            for (const request of requests) {
                try {
                    const response = await request();
                    const userData = getUserFromResponse(response.data) || response.data;

                    if (userData) {
                        this.user = normalizeUser(userData, userCode);
                        return this.user;
                    }
                } catch (error) {
                    lastError = error;
                }
            }

            throw lastError || new Error('Unable to load user profile.');
        },
        async registerAccount(payload: RegisterAccountPayload) {
            const axios = useAxios();
            const config = useRuntimeConfig();
            const endpoint = String(config.public.registerEndpoint || '/api/auth/register');
            const name = `${payload.firstName} ${payload.surname}`.trim();

            const response = await axios.post(endpoint, {
                username: payload.username,
                email: payload.email,
                password: payload.password,
                fullName: name || payload.username,
                phone: payload.mobile,
            });

            return response.data;
        },
        async updatePassword(currentPassword: string, newPassword: string) {
            try {
                const axios = useAxios();
                const response = await axios.post('/api/auth/change-password', {
                    oldPassword: currentPassword,
                    newPassword
                });

                if (response.data.message) {
                    return true;
                }
                throw new Error(response.data.message || 'Unable to update password.');
            } catch (error) {
                console.error("Failed to update password:", error);
                throw error;
            }
        },
        async getUserCertificates(page: number = 1, pageSize: number = 10) {
            try {
                const axios = useAxios();
                const response = await axios.post(`/api/User/listviewcertbyemp?page=${page}&pageSize=${pageSize}`, {
                    PQU_PERSON: {
                        SearchText: this.user.PER_CODE.toUpperCase(),
                        SearchType: "eq"
                    }
                });
                this.certificates = response.data.data;
            } catch (error) {
                console.error("Failed to get user certificates:", error);
                throw error;
            }
        }
    },
    persist: true
});

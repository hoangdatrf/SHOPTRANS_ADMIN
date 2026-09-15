import { defineStore } from "pinia";
import { useAxios } from "~/composables/axios";
import dayjs from 'dayjs'

interface Account {
    Id: number;
    UserName: string;
    Password: string;
    Email: string | null;
    FamilyName: string;
    Name: string;
    FcmToken: string | null;
    SmartcaUsername: string | null;
    SmartcaPassword: string | null;
    CCCD: string;
    ChucVu: string;
    NotUsed: string;
    Org: string;
    WorkPlace: string;
}

export type AuthUserRole = 'ADMIN' | 'USER';

export interface AuthUser {
    id: string;
    username?: string | null;
    email: string;
    fullName: string;
    phone?: string | null;
    role: AuthUserRole;
    isActive: boolean;
    lastLoginAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAuthUserPayload {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: AuthUserRole;
    isActive?: boolean;
}

const unwrapResponseData = (payload: any) => {
    return payload?.data ?? payload;
}

export const useAdminStore = defineStore("admin", {
    state: () => ({
        accounts: [] as Account[],
        authUsers: [] as AuthUser[],
        accountDetail: {} as Account,
        selectedAccount: null as string | null,
        isLoadingAccountDetail: false as boolean,
        isLoadingAuthUsers: false as boolean,
        isUpdatingAuthUser: false as boolean,
        authUsersError: '' as string,
        currentUserDepartment: [] as any[],
        currentUserOrg: [] as any[],
    }),
    actions: {
        async fetchAccountList(page = 1, pageSize = 10, sortField = "", sortOrder = "", searchText = "", searchFillter: any = null) {
            try {
                console.log(searchFillter);
                // console.log(JSON.stringify(processStringProperties(searchFillter)));
                const axios = useAxios();
                let url = `/api/User/listview?page=${page}&pageSize=${pageSize}`;

                if (searchText && searchText.trim() !== "") {
                    url += `&search=${searchText}`;
                }

                const response = await axios.post(url, searchFillter);
                console.log(response.data);
                this.accounts = response.data;
            } catch (error) {
                console.error("Failed to fetch assets:", error);
            }
        },
        async fetchAccountDetail(username: string) {
            try {
                const axios = useAxios();
                this.isLoadingAccountDetail = true;
                const response = await axios.get(`/api/User/detailbyid?username=${username}`);
                console.log(response.data);
                this.accountDetail = response.data.user;
                await Promise.all([
                    this.getUserDepartment(username),
                    this.getUserOrg(username)
                ]);
                this.isLoadingAccountDetail = false;
            } catch (error) {
                console.error("Failed to fetch account detail:", error);
                this.isLoadingAccountDetail = false;
            }
        },
        async changePassword(username: string, newPassword: string) {
            const axios = useAxios();
            const response = await axios.post(`/api/User/changepassword`, {
                UserName: username,
                Password: newPassword
            });
            console.log(response.data);
            return response.data;
        },
        async getUserDepartment(username: string) {
            try {
                const axios = useAxios();
                const response = await axios.get(`/api/User/listdeptbyemp?employeeCode=${username.toUpperCase()}`);
                this.currentUserDepartment = response.data.data.map((item: any) => ({ value: item.EM_DEPT, label: item.EM_DEPT }));
            } catch (error) {
                console.error("Failed to fetch user department:", error);
            }
        },
        async getUserOrg(username: string) {
            try {
                const axios = useAxios();
                const response = await axios.get(`/api/User/listorgbyemp?employeeCode=${username.toUpperCase()}`);
                this.currentUserOrg = response.data.data.map((item: any) => ({ value: item.EM_ORG, label: item.EM_ORG }));
            } catch (error) {
                console.error("Failed to fetch user org:", error);
            }
        },
        async fetchAuthUsers() {
            const axios = useAxios();
            this.isLoadingAuthUsers = true;
            this.authUsersError = '';

            try {
                const response = await axios.get('/api/users');
                const users = unwrapResponseData(response.data);
                this.authUsers = Array.isArray(users) ? users : [];
                return this.authUsers;
            } catch (error: any) {
                this.authUsers = [];
                this.authUsersError = error?.response?.data?.message || error?.message || 'Could not load accounts.';
                throw error;
            } finally {
                this.isLoadingAuthUsers = false;
            }
        },
        async updateAuthUser(id: string, payload: Partial<Pick<AuthUser, 'fullName' | 'phone' | 'role' | 'isActive'>>) {
            const axios = useAxios();
            this.isUpdatingAuthUser = true;
            this.authUsersError = '';

            try {
                const response = await axios.patch(`/api/users/${id}`, payload);
                const updated = unwrapResponseData(response.data) as AuthUser;
                const index = this.authUsers.findIndex(user => user.id === id);

                if (index >= 0) {
                    this.authUsers[index] = updated;
                }

                return updated;
            } catch (error: any) {
                this.authUsersError = error?.response?.data?.message || error?.message || 'Could not update account.';
                throw error;
            } finally {
                this.isUpdatingAuthUser = false;
            }
        },
        async createAuthUser(payload: CreateAuthUserPayload) {
            const axios = useAxios();
            this.isUpdatingAuthUser = true;
            this.authUsersError = '';

            try {
                const response = await axios.post('/api/users', payload);
                const created = unwrapResponseData(response.data) as AuthUser;
                this.authUsers = [created, ...this.authUsers.filter(user => user.id !== created.id)];
                return created;
            } catch (error: any) {
                this.authUsersError = error?.response?.data?.message || error?.message || 'Could not create account.';
                throw error;
            } finally {
                this.isUpdatingAuthUser = false;
            }
        },
        async disableAuthUser(id: string) {
            const axios = useAxios();
            this.isUpdatingAuthUser = true;
            this.authUsersError = '';

            try {
                const response = await axios.delete(`/api/users/${id}`);
                const updated = unwrapResponseData(response.data) as AuthUser;
                const index = this.authUsers.findIndex(user => user.id === id);

                if (index >= 0) {
                    this.authUsers[index] = updated;
                }

                return updated;
            } catch (error: any) {
                this.authUsersError = error?.response?.data?.message || error?.message || 'Could not disable account.';
                throw error;
            } finally {
                this.isUpdatingAuthUser = false;
            }
        },
    },
})

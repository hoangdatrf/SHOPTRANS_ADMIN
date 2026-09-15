import { defineStore } from "pinia";

export const useAssetStore = defineStore("asset", {
    state: () => ({
        orgs: [] as any[],
        departments: [] as any[],
    }),
    actions: {
        async fetchOrg() {
            try {
                const axios = useAxios();
                const url = `/api/Asset/lookupOrg`;
                const response = await axios.post(url);
                this.orgs = response.data.data ?? response.data ?? [];
            } catch (error) {
                console.error("Failed to fetch org (assetStore):", error);
            }
        },
        async fetchDepartments() {
            try {
                const axios = useAxios();
                const url = `/api/Asset/lookupDepartment?page=1&pageSize=10000`;
                const response = await axios.post(url);
                this.departments = response.data.data ?? response.data ?? [];
            } catch (error) {
                console.error("Failed to fetch departments (assetStore):", error);
            }
        },
    },
});

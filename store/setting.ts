import { defineStore } from "pinia";

export const useSettingStore = defineStore("setting", {
    state: () => ({
        orgs: [] as any[],
        //
    }),
    actions: {
        async fetchOrg() {
            try {
                const axios = useAxios();
                let url = `/api/Asset/lookupOrg`
                const response = await axios.post(url);
                this.orgs = response.data.data;
            } catch (error) {
                console.error("Failed to fetch org:", error);
            }
        },
    },

})
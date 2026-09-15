import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
    state: () => ({
        sizeBarWidth: 20,
        showSupportPanel: false,
        //
    }),
    actions: {
        setCurrentSizebarWidth(width: number) {
            this.sizeBarWidth = width;
        },
        openSupportPanel() {
            this.showSupportPanel = true;
        },
        closeSupportPanel() {
            this.showSupportPanel = false;
        }
    },

})
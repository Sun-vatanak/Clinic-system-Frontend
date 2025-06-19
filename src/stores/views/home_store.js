import axios from "axios";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth/auth";
// ...existing code...
export const useHomeStore = defineStore("views/home_store", {
    state: () => ({
        vendorDash: {},
        orderChart: {},
        adminDash: {},
        customerChart: {},
        orderAminChart: {},
        userMeta: {} 
    }),
    actions: {
        async onloadUserSummeries() {
            const authStore = useAuthStore();
            try {
                const res = await axios.get(`/api/users`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });

                if (res.data.result) {
                    this.vendorDash = res.data.data;
                    this.userMeta = res.data.meta; // <-- store meta here
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        },
        
    },
});

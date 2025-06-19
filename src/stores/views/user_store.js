import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useUserStore = defineStore("user_store", {
  state: () => ({
    frm: {
      id: null,
      first_name: "",
      last_name: "",
      photo: "",
      gender_id: 1,
      email: "",
      phone: "",
      address: "",
      role_id: "",
      telegram_id: "",
      is_active: 1,
      is_remove: 0,
      pass: "",
      con_pass: "",
      created_at: "",
      updated_at: "",
    },

    crop: {
      img: "",
      blob: null,
      avatar: "/default.png",
    },

    // UI state
    v_validate: null,
    selectedId: null,
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 1,
    total_records: 0,
    error_Message: "",

    mdl_add: null,
    mdl_delete: null,
    mdl_edit: null,
    mdl_crop: null,
    mdl_view: null,
    itemsPerPage: 6,
    data_users: ref([]),
    searchQuery: ref(""),
    selectedRole: ref(""),
    isLoading: ref(false),
    isProfileLoading: ref(false),
    vendorDash: {},
    orderChart: {},
    adminDash: {},
    customerChart: {},
    orderAminChart: {},
  
  }),

  actions: {
    async onloadUser() {
      this.isLoading = true;
      
      try {
        const response = await axios.get("/api/users", {
          params: {
            page: this.currentPage,
            per_page: this.itemsPerPage,
            search: this.searchQuery,
            role_id: this.selectedRole,
            
            scol: "id",
            sdir: "desc"
          }
        });

        if (response.data) {
          this.data_users = response.data.data || [];
          
          if (response.data.meta) {
            this.totalPages = response.data.meta.last_page;
            this.total_records = response.data.meta.total;
            this.currentPage = response.data.meta.current_page;
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        this.data_users = [];
        this.error_Message = "Failed to load users. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.onloadUser();
      }
    },

    resetForm() {
      this.frm = {
        id: null,
        first_name: "",
        last_name: "",
        photo: "",
        gender_id: 1,
        email: "",
        phone: "",
        address: "",
        role_id: "",
        telegram_id: "",
        is_active: 1,
        is_remove: 0,
        pass: "",
        con_pass: "",
        created_at: "",
        updated_at: "",
      };
      this.crop = {
        img: "",
        blob: null,
        avatar: "/default.png",
      };
      if (this.v_validate) {
        this.v_validate.$reset();
      }
    }
  }
});
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useCategoryStore = defineStore('categoryStore', {
    state: () => ({
        // Form fields
        frm: {
            name: '',
            description: '',    
            is_remove: 0,
            photo: ''
        },
        
        // Image cropping
        crop: {
            img: '',
            blob: null,
            avatar: '/default.png'
        },
        
        // UI state
        v_validate: null,
        selectedId: 0,
        error_message: "",
        mdl_add: null,
        mdl_delete: null,
        mdl_edit: null,
        mdl_crop: null,
        modalErrorTypeImage: null,
        
        // Data state
        categories: ref([]),
        currentPage: ref(1),
        itemsPerPage: 10,
        totalPages: ref(1),
        totalRecords: ref(0),
        searchQuery: ref(""),
        isLoading: ref(false),
        
        // Meta data
        meta: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
        }
    }),

    actions: {
        async onloadCategory() {
            this.isLoading = true;
            try {
                const response = await axios.get(
                    `/api/categories?scol=id&sdir=desc&per_page=${this.itemsPerPage}&page=${this.currentPage}&search=${this.searchQuery}`
                );
                
                if (response.data.result) {
                    this.categories = response.data.data;
                    
                    // Update meta data from response
                    if (response.data.meta) {
                        this.meta = {
                            current_page: response.data.meta.current_page,
                            last_page: response.data.meta.last_page,
                            per_page: response.data.meta.per_page,
                            total: response.data.meta.total
                        };
                        this.totalRecords = response.data.meta.total;
                        this.totalPages = response.data.meta.last_page;
                    }
                    
                    console.log('Categories loaded:', this.categories);
                    console.log('Meta data:', this.meta);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                this.error_message = "Failed to load categories";
            } finally {
                this.isLoading = false;
            }
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.onloadCategory();
            }
        }
    }
});
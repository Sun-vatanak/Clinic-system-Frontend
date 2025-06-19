<template>
    <div class="row gy-3">
        <div v-if="userStore.total_records > 0" class="col-12 ps-3 col-md-6 d-flex justify-content-center justify-content-md-start mb-3">
            <span>បង្ហាញ {{ (userStore.currentPage - 1) * userStore.itemsPerPage + 1 }} ដល់
                {{ Math.min(userStore.currentPage * userStore.itemsPerPage, userStore.total_records) }}
                នៃ
                {{ userStore.total_records }} ទិន្នន័យ</span>
        </div>
        <div class="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
            <nav v-if="userStore.totalPages > 1" aria-label="Page navigation" class="mt-3">
                <ul class="pagination">
                    <li class="page-item" :class="{ disabled: userStore.currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="userStore.changePage(userStore.currentPage - 1)">
                            &laquo;
                        </a>
                    </li>

                    <li v-if="showFirstPage" class="page-item">
                        <a class="page-link" href="#" @click.prevent="userStore.changePage(1)">1</a>
                    </li>

                    <li v-if="showFirstEllipsis" class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>

                    <li v-for="page in visiblePages" :key="page" class="page-item"
                        :class="{ active: userStore.currentPage === page }">
                        <a class="page-link" href="#" @click.prevent="userStore.changePage(page)">{{ page }}</a>
                    </li>

                    <li v-if="showLastEllipsis" class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>

                    <li v-if="showLastPage" class="page-item">
                        <a class="page-link" href="#" @click.prevent="userStore.changePage(userStore.totalPages)">
                            {{ userStore.totalPages }}
                        </a>
                    </li>

                    <li class="page-item" :class="{ disabled: userStore.currentPage === userStore.totalPages }">
                        <a class="page-link" href="#" @click.prevent="userStore.changePage(userStore.currentPage + 1)">
                            &raquo;
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from '@/stores/views/user_store';

const userStore = useUserStore();

const visiblePages = computed(() => {
    const maxVisiblePages = 5;
    const pages = [];
    let start = Math.max(1, userStore.currentPage - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;
    
    // Adjust if we're near the end
    if (end > userStore.totalPages) {
        end = userStore.totalPages;
        start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    
    return pages;
});

const showFirstPage = computed(() => {
    return visiblePages.value[0] > 1;
});

const showFirstEllipsis = computed(() => {
    return visiblePages.value[0] > 2;
});

const showLastPage = computed(() => {
    return visiblePages.value[visiblePages.value.length - 1] < userStore.totalPages;
});

const showLastEllipsis = computed(() => {
    return visiblePages.value[visiblePages.value.length - 1] < userStore.totalPages - 1;
});
</script>
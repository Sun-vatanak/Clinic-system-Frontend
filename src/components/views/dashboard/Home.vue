<template>
   <section class="home-dashboard mt-4">
      <div class="row g-4">
         <div class="col-12 col-lg-3 col-sm-6">
            <div class="bg-white rounded-4 border-0 p-4 d-flex flex-column justify-content-center gap-3">
               <div class="d-flex align-items-center justify-content-between">
                  <div class="m-0 text-dark-emphasis fw-semibold">
                     {{ authStore.user?.role?.id == 1 ? 'អ្នកប្រើប្រាស់' : 'ប្រាក់ចំណូលសរុប' }}
                  </div>
                  <div class="btn-action-summary bg-light">
                     <template v-if="authStore.user?.role?.id === 1">
                        <i class="bi bi-person text-primary fw-medium fs-5"></i>
                     </template>
                     <template v-else>
                        <span class="text-primary fw-medium fs-5">៛</span>
                     </template>
                  </div>
               </div>
               <p class="fs-3 fw-semibold m-0">
              {{ homeStore.userMeta?.total }}
               </p>
            </div>
         </div>
         <div class="col-12 col-lg-3 col-sm-6">
            <div class="bg-white rounded-4 border-0 p-4 d-flex flex-column justify-content-center gap-3">
               <div class="d-flex align-items-center justify-content-between">
                  <div class="m-0 text-dark-emphasis fw-semibold">
                     {{ authStore.user?.role?.id == 1 ? 'វេជ្ជបណ្ឌិត' : 'ផលិតផលសរុប' }}
                  </div>
                  <div class="btn-action-summary bg-light">
                     <template v-if="authStore.user?.role?.id === 1">
                        <i class="bi bi-person-workspace text-primary fw-medium fs-5"></i>
                     </template>
                     <template v-else>
                        <i class="bi-box-seam text-primary fw-medium fs-5"></i>
                     </template>
                  </div>
               </div>
               <p class="fs-3 fw-semibold m-0">
                  {{ homeStore.userMeta?.total_doctors }}
               </p>
            </div>
         </div>
         <div class="col-12 col-lg-3 col-sm-6">
            <div class="bg-white rounded-4 border-0 p-4 d-flex flex-column justify-content-center gap-3">
               <div class="d-flex align-items-center justify-content-between">
                  <div class="m-0 text-dark-emphasis fw-semibold">
                     {{ authStore.user?.role?.id == 1 ? 'អ្នកដឹកជំងឺ' : 'ការកម្មង់សរុប' }}
                  </div>
                  <div class="btn-action-summary bg-light">
                     <template v-if="authStore.user?.role?.id === 1">
                        <i class="bi bi-person-gear text-primary fw-medium fs-5"></i>
                     </template>
                     <template v-else>
                        <i class="bi bi-card-list text-primary fw-medium fs-5"></i>
                     </template>
                  </div>
               </div>
               <p class="fs-3 fw-semibold m-0">
              
               </p>
            </div>
         </div>
     
         <div class="col-12 col-lg-3 col-sm-6">
            <div class="bg-white rounded-4 border-0 p-4 d-flex flex-column justify-content-center gap-3">
               <div class="d-flex align-items-center justify-content-between">
                  <div class="m-0 text-dark-emphasis fw-semibold">
                     {{ authStore.user?.role?.id == 1 ? 'ផលិតផលសរុប' : 'អតិថិជនសរុប' }}
                  </div>
                  <div class="btn-action-summary bg-light">
                     <template v-if="authStore.user?.role?.id === 1">
                        <i class="bi bi-box-seam text-primary fw-medium fs-5"></i>
                     </template>
                     <template v-else>
                        <i class="bi bi-people text-primary fw-medium fs-5"></i>
                     </template>
                  </div>
               </div>
               <p class="fs-3 fw-semibold m-0">
                  {{ categoryStore.meta.total }}
               </p>
            </div>
         </div>
         
         <div :class="{ 'col-12': authStore.user?.role?.id == 2, 'col-12 col-xl-9': authStore.user?.role?.id == 1 }">
            <BarChart />
         </div>
         <div class="col-12 col-xl-3" v-if="authStore.user?.role?.id == 1">
            <DoughnutChart />
         </div>
      </div>
   </section>
</template>

<script setup>
import { onMounted } from "vue";
import BarChart from "@/components/views/dashboard/BarChart.vue";
import DoughnutChart from "@/components/views/dashboard/DoughnutChart.vue";
import { useHomeStore } from "@/stores/views/home_store";
import { useAuthStore } from "@/stores/views/auth/auth";
import { useCategoryStore } from "@/stores/views/category_store";

const authStore = useAuthStore();
const homeStore = useHomeStore();
const categoryStore = useCategoryStore();

onMounted(async () => {
   if (authStore.user?.role?.id == 1) {
      await homeStore.onloadUserSummeries();
      await categoryStore.onloadCategory();
      
      // Debug logs
      console.log('Category store meta:', categoryStore.meta);
      console.log('Total categories:', categoryStore.meta.total);
   }

   if (authStore.user?.role?.id == 2) {
      await homeStore.onloadVendorSummeries();
   }
});

const formatCurrency = (value) => {
   return new Intl.NumberFormat('km-KH', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
   }).format(value) + '៛';
};
</script>

<template>
  <div class="rounded-4 p-4 h-100 bg-white">
    <div class="row gy-4">
      <div class="col-12 lh-1">
        <h5 class="text-dark-emphasis">អ្នកចុះឈ្មោះប្រចាំថ្ងៃ</h5>
      </div>
      <div class="col-12 position-relative  ">
        <DoughnutChart 
          v-if="chartDataInitialized"
          :chart-data="chartData" 
          :options="chartOptions" 
          :height="230" 
          :width="230" 
      
        />
        <div v-else class="loading-chart">Loading chart...</div>
        
        <div class="chart-text lh-1">
          <h5>{{ totalRegistrations }} នាក់</h5>
          <span>{{ formattedDate }}</span>
        </div>
      </div>
      <div class="col-12">
        <div class="d-flex align-items-center flex-wrap justify-content-center gap-3">
          <div class="d-flex align-items-center gap-2">
            <div class="male rounded-circle"></div>
            <span class="fs-14">ភេទប្រុស {{ maleCount }} នាក់</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <div class="female rounded-circle"></div>
            <span class="fs-14">ភេទស្រី {{ femaleCount }} នាក់</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import { computed, ref, onMounted } from 'vue';
import { useHomeStore } from "@/stores/views/home_store";

// Register Chart.js components
Chart.register(...registerables);

const homeStore = useHomeStore();
const chartDataInitialized = ref(false);

// Data refs
const maleCount = ref(0);
const femaleCount = ref(0);
const totalRegistrations = ref(0);

// Date formatting
const formattedDate = computed(() => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Phnom_Penh' 
  };
  return new Date().toLocaleDateString('km-KH', options);
});

// Chart data
const chartData = computed(() => ({
  labels: ['ប្រុស', 'ស្រី'],
  datasets: [{
    data: [maleCount.value, femaleCount.value],
    backgroundColor: ['#2F6BFF', '#03B8FA'],
    borderWidth: 0,
    hoverOffset: 10
  }]
}));

// Chart options
const chartOptions = computed(() => ({
  cutout: '70%',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((context.raw / total) * 100);
          return `${context.label}: ${context.raw} នាក់ (${percentage}%)`;
        }
      },
      padding: 12,
      bodyFont: {
        size: 14
      }
    }
  }
}));

// Load data and initialize chart
onMounted(async () => {
  try {
    await homeStore.onloadUserSummeries();
    
    // Set values from store
    maleCount.value = homeStore.userMeta?.male || 0;
    femaleCount.value = homeStore.userMeta?.female || 0;
    totalRegistrations.value = homeStore.userMeta?.registrations_total || 0;
    
    chartDataInitialized.value = true;
  } catch (error) {
    console.error('Error loading chart data:', error);
  }
});
</script>

<style scoped>
.chart-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.male {
  width: 12px;
  height: 12px;
  background-color: #2F6BFF;
}

.female {
  width: 12px;
  height: 12px;
  background-color: #03B8FA;
}

.loading-chart {
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style>
<template>
  <div class="breakdown-chart-container retro-box">
    <h3>Dog vs Bonus Points</h3>
    <div class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  dogPoints: {
    type: Number,
    required: true
  },
  bonusPoints: {
    type: Number,
    required: true
  }
});

const chartData = computed(() => ({
  labels: ['Dog Points', 'Bonus Points'],
  datasets: [
    {
      backgroundColor: ['#f44336', '#2196f3'], // Comic Red and Blue
      borderColor: '#111',
      borderWidth: 2,
      data: [props.dogPoints, props.bonusPoints]
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          family: 'Bangers',
          size: 16
        },
        color: '#000'
      }
    }
  }
};
</script>

<style scoped>
.breakdown-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-wrapper {
  flex-grow: 1;
  width: 100%;
  min-height: 250px;
}

h3 {
  margin-top: 0;
  text-align: center;
  color: var(--color-comic-purple);
}
</style>

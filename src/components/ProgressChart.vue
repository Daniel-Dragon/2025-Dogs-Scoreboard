<template>
  <div class="chart-container retro-box">
    <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
    <div v-else class="loading-chart">Loading Chart Data...</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  history: {
    type: Array,
    required: true
  }
});

const chartData = computed(() => {
  // Sort history by date ascending for the chart
  const sortedHistory = [...props.history].sort((a, b) => new Date(a.date) - new Date(b.date));

  const labels = sortedHistory.map(h => {
    const d = new Date(h.date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  // Calculate cumulative points
  let cumulative = 0;
  const dataPoints = sortedHistory.map(h => {
    cumulative += h.totalPoints;
    return cumulative;
  });

  return {
    labels,
    datasets: [
      {
        label: 'Cumulative Points',
        backgroundColor: '#00ffff',
        borderColor: '#ff00ff',
        borderWidth: 3,
        pointBackgroundColor: '#fff01f',
        pointBorderColor: '#000',
        pointRadius: 6,
        pointHoverRadius: 8,
        data: dataPoints,
        tension: 0.2
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: {
          family: 'Bangers',
          size: 16
        },
        color: '#000'
      }
    },
    title: {
      display: true,
      text: 'Points Progression',
      font: {
        family: 'Bangers',
        size: 24
      },
      color: '#8a2be2'
    }
  },
  scales: {
    x: {
      grid: {
        color: '#ccc',
        borderDash: [5, 5]
      },
      ticks: {
          font: {
            family: 'Bangers',
          },
          color: '#000'
      }
    },
    y: {
      grid: {
        color: '#ccc',
        borderDash: [5, 5]
      },
      ticks: {
          font: {
            family: 'Bangers',
          },
          color: '#000'
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  height: 400px;
  position: relative;
}

.loading-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: 'Bangers', cursive;
  font-size: 2rem;
  color: var(--color-purple);
}
</style>

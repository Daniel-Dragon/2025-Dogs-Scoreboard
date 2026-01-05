<template>
  <div class="chart-container retro-box">
    <Line v-if="chartData.datasets.length" :data="chartData" :options="chartOptions" />
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
  contestants: {
    type: Array,
    required: true
  }
});

const chartData = computed(() => {
  // We need a common set of dates (x-axis)
  // 1. Collect all unique dates from all contestants' history
  const allDates = new Set();
  props.contestants.forEach(c => {
    c.history.forEach(h => allDates.add(h.date));
  });

  // Sort dates chronologically
  const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

  const labels = sortedDates.map(d => {
    const dateObj = new Date(d);
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
  });

  // Generate distinct colors for lines
  const colors = [
    '#ff00ff', '#00ffff', '#39ff14', '#fff01f', '#8a2be2',
    '#ff4500', '#1e90ff', '#ff1493', '#00ced1', '#ffd700'
  ];

  const datasets = props.contestants.map((c, index) => {
    // Build a map of date -> total cumulative points up to that date
    // But first we need to make sure the history is sorted
    const sortedHistory = [...c.history].sort((a, b) => new Date(a.date) - new Date(b.date));

    // We need to fill in gaps. For each date in global sortedDates:
    // what was the cumulative score at that point?
    const dataPoints = [];
    let cumulative = 0;
    let historyIndex = 0;

    sortedDates.forEach(dateStr => {
      // Add up all points from history entries on this date
      // Note: A contestant might have multiple entries on one day?
      // Assuming unique dates per contestant or we sum them.
      // Let's iterate through history until we pass the current dateStr

      while (historyIndex < sortedHistory.length) {
         const h = sortedHistory[historyIndex];
         const hDate = new Date(h.date);
         const targetDate = new Date(dateStr);

         if (hDate.getTime() <= targetDate.getTime()) {
           // If the history entry is on or before the target date, add to cumulative
           // Wait, if it's strictly before, we should have added it already for previous steps.
           // This logic is slightly tricky.
           // Simpler approach: Filter history for all entries <= dateStr
           // Ideally we shouldn't re-loop for performance, but dataset is small.
           break; // Let's rethink inside the map
         }
         historyIndex++;
      }

      // Re-calculate cumulative for this specific date
      // Filter all history items where date <= current date step
      const relevantHistory = c.history.filter(h => new Date(h.date) <= new Date(dateStr));
      const score = relevantHistory.reduce((sum, h) => sum + h.totalPoints, 0);
      dataPoints.push(score);
    });

    return {
      label: c.name,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length],
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
      data: dataPoints,
      tension: 0.2
    };
  });

  return {
    labels,
    datasets
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
          size: 14
        },
        color: '#000'
      }
    },
    title: {
      display: true,
      text: 'THE GREAT RACE 🏁',
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
  height: 500px;
  position: relative;
  background-color: #fff;
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

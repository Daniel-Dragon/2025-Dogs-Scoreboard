<template>
  <div class="contestant-view">
    <button class="back-btn" @click="router.push('/')" aria-label="Back to Leaderboard">
      <span aria-hidden="true">👈</span> Back to Leaderboard
    </button>

    <div v-if="loading" class="loading-state" role="status" aria-live="polite">Loading Profile...</div>

    <div v-else-if="contestant" class="profile-container">
      <div class="profile-header retro-box">
        <div class="profile-image-wrapper">
          <img :src="contestant.image" :alt="contestant.name" class="profile-image" @error="handleImageError">
        </div>
        <div class="profile-info">
          <h1>{{ contestant.name }}</h1>
          <div class="total-score">
            TOTAL POINTS: <span>{{ contestant.totalPoints }}</span>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <div class="main-chart">
           <ProgressChart :history="contestant.history" :contestant-name="contestant.name" />
        </div>
      </div>

      <div class="stats-grid">
        <ComicStatBubble :text="contestant.eiffelSentence" />
        <ComicStatBubble :text="contestant.pizzaSentence" />
        <ComicStatBubble :text="contestant.ninjaSentence" />
        <ComicStatBubble :text="contestant.manholeSentence" />
      </div>

      <div class="history-log retro-box">
        <h2 id="history-heading">Eating History</h2>
        <table class="history-table" aria-labelledby="history-heading">
          <thead>
            <tr>
              <th>Date</th>
              <th>Dog Points</th>
              <th>Creative Points</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, idx) in contestant.history" :key="idx">
              <td>{{ formatDate(entry.date) }}</td>
              <td>{{ entry.dogPoints }}</td>
              <td>{{ entry.creativePoints }}</td>
              <td>{{ entry.totalPoints }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="error-state">
      <h2>Contestant Not Found! 😱</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../store';
import { fetchData } from '../services/dataService';
import ComicStatBubble from '../components/ComicStatBubble.vue';
import ProgressChart from '../components/ProgressChart.vue';
import { format } from 'date-fns';

const route = useRoute();
const router = useRouter();
const contestant = ref(null);
const loading = ref(true);

onMounted(async () => {
  const name = route.params.name;

  if (store.contestants.length === 0) {
    const { contestants, recentActivity } = await fetchData();
    store.setContestants(contestants);
    store.setRecentActivity(recentActivity);
  }

  contestant.value = store.getContestantByName(name);
  if (!contestant.value) {
    router.push('/');
    return;
  }
  loading.value = false;
});

const formatDate = (dateString) => {
   try {
    const date = new Date(dateString);
    if (!isNaN(date)) {
        return format(date, 'MMM do, yyyy');
    }
    return dateString;
  } catch (e) {
    return dateString;
  }
};

const handleImageError = (e) => {
  e.target.src = `${import.meta.env.BASE_URL}images/placeholder.svg`;
};
</script>

<style scoped>
.back-btn {
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  background: var(--color-neon-cyan);
}

.profile-image-wrapper {
  flex-shrink: 0;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid var(--color-white);
  box-shadow: 5px 5px 0 var(--color-black);
  object-fit: cover;
  object-position: top;
}

.profile-info h1 {
  font-size: 3rem;
  margin: 0 0 10px 0;
  color: var(--color-black);
  text-shadow: 2px 2px 0 var(--color-white);
}

.total-score {
  font-family: 'Bangers', cursive;
  font-size: 2rem;
  color: var(--color-purple);
}

.total-score span {
  font-size: 3rem;
  color: var(--color-neon-pink);
  text-shadow: 2px 2px 0 var(--color-white);
}

.charts-row {
  margin-top: 30px;
}

.main-chart {
  min-width: 0; /* Critical for preventing grid blowout with charts */
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 30px 0;
}

.history-log {
  margin-top: 30px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  background-color: var(--color-black);
  color: var(--color-neon-green);
  text-align: left;
  padding: 10px;
}

.history-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.loading-state, .error-state {
  text-align: center;
  color: var(--color-white);
  font-family: 'Bangers', cursive;
  font-size: 2rem;
}

@media (max-width: 600px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>

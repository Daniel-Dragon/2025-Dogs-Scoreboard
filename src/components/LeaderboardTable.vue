<template>
  <div class="leaderboard-container retro-box">
    <h2>🏆 Top Dogs Leaderboard 🏆</h2>
    <div class="table-responsive">
      <table class="leaderboard-table" role="table">
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader">Rank</th>
            <th role="columnheader">Contestant</th>
            <th role="columnheader">Total Points</th>
            <th role="columnheader">Hot Dogs Eaten</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          <tr
            v-for="(contestant, index) in contestants"
            :key="contestant.name"
            class="contestant-row"
            @click="goToProfile(contestant.name)"
            @keydown.enter.prevent="goToProfile(contestant.name)"
            @keydown.space.prevent="goToProfile(contestant.name)"
            role="row"
            tabindex="0"
          >
            <td class="rank-cell" role="cell">
              <span class="mobile-label" aria-hidden="true">Rank:</span>
              <span v-if="index === 0" aria-label="First Place" role="img">👑</span>
              <span v-else-if="index === 1" aria-label="Second Place" role="img">🥈</span>
              <span v-else-if="index === 2" aria-label="Third Place" role="img">🥉</span>
              <span v-else :aria-label="'Rank ' + (index + 1)">#{{ index + 1 }}</span>
            </td>
            <td class="profile-cell" role="cell">
              <span class="mobile-label" aria-hidden="true">Contestant:</span>
              <div class="profile-wrapper">
                <img :src="contestant.image" :alt="contestant.name" class="profile-thumb" @error="handleImageError">
                <span class="contestant-name">{{ contestant.name }}</span>
              </div>
            </td>
            <td class="points-cell" role="cell">
              <span class="mobile-label" aria-hidden="true">Total Points:</span>
              {{ contestant.totalPoints }}
            </td>
            <td class="dogs-cell" role="cell">
              <span class="mobile-label" aria-hidden="true">Hot Dogs:</span>
              {{ contestant.totalDogs }} 🌭
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  contestants: {
    type: Array,
    required: true
  }
});

const router = useRouter();

const goToProfile = (name) => {
  router.push({ name: 'contestant', params: { name } });
};

const handleImageError = (e) => {
  e.target.src = `${import.meta.env.BASE_URL}images/placeholder.svg`;
};
</script>

<style scoped>
.leaderboard-container {
  background-color: var(--color-white);
}

.table-responsive {
  overflow-x: auto;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Comic Sans MS', cursive;
}

th {
  background-color: var(--color-neon-pink);
  color: var(--color-white);
  padding: 15px;
  text-align: left;
  font-family: 'Bangers', cursive;
  font-size: 1.5rem;
  letter-spacing: 1px;
  border-bottom: 4px solid var(--color-black);
}

td {
  padding: 15px;
  border-bottom: 2px solid #ccc;
  vertical-align: middle;
}

.contestant-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.contestant-row:hover,
.contestant-row:focus-visible {
  background-color: var(--color-neon-yellow);
  outline: 3px solid var(--color-purple);
  outline-offset: -3px;
}

.rank-cell {
  font-size: 1.5rem;
  font-weight: bold;
}

.profile-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-thumb {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid var(--color-neon-green);
  object-fit: cover;
  object-position: top;
}

.contestant-name {
  font-weight: bold;
  font-size: 1.2rem;
}

.points-cell {
  font-weight: bold;
  font-size: 1.4rem;
  color: var(--color-purple);
}

.dogs-cell {
  font-size: 1.2rem;
}

.mobile-label {
  display: none;
}

@media (max-width: 600px) {
  /* Force table to not be like tables anymore */
  .leaderboard-table,
  .leaderboard-table thead,
  .leaderboard-table tbody,
  .leaderboard-table th,
  .leaderboard-table td,
  .leaderboard-table tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  .leaderboard-table thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .leaderboard-table tr {
    margin-bottom: 2rem;
    border: 3px solid var(--color-black);
    box-shadow: 5px 5px 0 var(--color-black);
    background-color: var(--color-white);
  }

  .leaderboard-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .leaderboard-table td {
    /* Behave like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: right;
    padding: 15px;
  }

  .leaderboard-table td:last-child {
    border-bottom: none;
  }

  .mobile-label {
    display: inline-block;
    font-weight: bold;
    font-family: 'Bangers', cursive;
    color: var(--color-purple);
    font-size: 1.2rem;
  }

  /* Adjust profile wrapper for mobile flex layout */
  .profile-wrapper {
    justify-content: flex-end;
  }

  /* Stack label and content for profile cell on small screens */
  .leaderboard-table .profile-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    text-align: left;
  }

  .leaderboard-table .profile-cell .profile-wrapper {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>

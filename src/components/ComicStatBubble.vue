<template>
  <div class="stats-bubble">
    <div class="bubble-tail"></div>
    <div class="stat-content">
      <p class="stat-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.stats-bubble {
  background-color: var(--color-comic-white);
  border: 4px solid var(--color-comic-black);
  border-radius: 20px;
  padding: 15px;
  margin: 15px;
  position: relative;
  max-width: 300px;
  box-shadow: 8px 8px 0 rgba(0,0,0,0.3);
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}

.stats-bubble:hover {
  transform: scale(1.05) rotate(1deg);
  z-index: 10;
  /* Removed border color change as requested */
}

.stat-text {
  font-family: 'Bangers', cursive;
  font-size: 1.2rem;
  line-height: 1.2;
  margin: 0;
  color: var(--color-comic-black);
}

/* Comic bubble tail */
.stats-bubble::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 30px;
  border-width: 20px 20px 0;
  border-style: solid;
  border-color: var(--color-comic-black) transparent;
  display: block;
  width: 0;
}

.stats-bubble::before {
  content: '';
  position: absolute;
  bottom: -13px;
  left: 34px;
  border-width: 16px 16px 0;
  border-style: solid;
  border-color: var(--color-comic-white) transparent;
  display: block;
  width: 0;
  z-index: 1;
}
</style>

<template>
  <div class="w-full h-full flex flex-col border border-gray-500 overflow-hidden">
    <div class="flex-1 relative border-r-4 border-red-500 overflow-hidden">
      <div class="h-full overflow-y-auto">
        <div
          v-for="(horse, index) in horsesWithProgress"
          :key="horse.horseId || index"
          class="flex items-center h-14 border-b border-dashed border-gray-300 px-4 relative"
        >
          <div class="w-10 h-14 border border-gray-100 bg-green-600 mr-4 z-10 flex items-center justify-center">
            <span class="w-full h-full flex items-center justify-center text-white font-bold -rotate-90">
              {{ index + 1 }}
            </span>
          </div>
          <div class="flex-1 relative h-12 bg-gray-100 border border-gray-300 rounded overflow-hidden">
            <div
              class="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-75 ease-linear"
              :style="{
                left: horse.position >= 100 ? 'calc(100% - 40px)' : `${horse.position}%`,
                width: '40px',
                height: '40px',
              }"
            >
              <div
                class="w-full h-full rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white"
                :style="{
                  backgroundColor: horse.color || '#gray-500',
                }"
              >
                🐴
              </div>
            </div>
          </div>
        </div>
        <div v-if="horsesWithProgress.length === 0" class="flex items-center justify-center h-full text-gray-400">
          <div class="text-center">
            <p class="text-lg">No race in progress</p>
            <p class="text-sm">Generate program and start race</p>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 flex items-center justify-between border-gray-300">
      <div></div>
      <div></div>
      <div class="text-sm text-gray-600 mb-1" v-if="currentRace">
        {{ currentRace.raceNumber }}ST Lap – {{ currentRace.distance }}m
      </div>
      <div class="text-sm text-gray-400 mb-1" v-else>Waiting for race...</div>
      <div class="text-lg font-bold text-red-500 tracking-widest">FINISH</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";
import soundManager from "@/utils/soundManager";

const store = useStore();

const currentRace = computed(() => store.getters["races/currentRace"]);
const racing = computed(() => store.getters["races/racing"]);

const horsePositions = ref({});
const animationFrame = ref(null);
const raceInterval = ref(null);

const allHorses = computed(() => store.getters["horses/horses"]);

const horsesWithProgress = computed(() => {
  if (!currentRace.value || !currentRace.value.horses) {
    return [];
  }

  return currentRace.value.horses.map((progHorse) => {
    const horse = allHorses.value.find((h) => h.id === progHorse.horseId);
    return {
      ...progHorse,
      color: horse?.color || "#gray-500",
      name: progHorse.name,
      condition: horse?.condition || 50,
      position: horsePositions.value[progHorse.horseId] || 0,
    };
  });
});

function calculateSpeed(condition, distance) {
  const baseSpeed = 0.2 + (condition / 100) * 0.6;

  const distanceFactor = 1 - (distance / 3000) * 0.15;

  const randomFactor = 0.85 + Math.random() * 0.3;

  return baseSpeed * distanceFactor * randomFactor;
}

function startRaceAnimation() {
  if (!currentRace.value || !racing.value) {
    return;
  }

  const isNewRace = Object.keys(horsePositions.value).length === 0;

  if (isNewRace) {
    const initialPositions = {};
    currentRace.value.horses.forEach((horse) => {
      initialPositions[horse.horseId] = 0;
    });
    horsePositions.value = { ...initialPositions };

    soundManager.playGunshot();
  }

  soundManager.startGallop();

  const distance = currentRace.value.distance;
  const finishLine = 100;

  const animate = () => {
    if (!racing.value || !currentRace.value) {
      return;
    }

    let raceFinished = false;
    let winner = null;

    currentRace.value.horses.forEach((progHorse) => {
      const horse = allHorses.value.find((h) => h.id === progHorse.horseId);
      if (!horse) return;

      const currentPos = horsePositions.value[progHorse.horseId] || 0;

      if (currentPos < finishLine) {
        const speed = calculateSpeed(horse.condition, distance);
        const newPos = Math.min(finishLine, currentPos + speed);
        horsePositions.value[progHorse.horseId] = newPos;

        if (newPos >= finishLine && !raceFinished) {
          raceFinished = true;
          winner = progHorse;
        }
      }
    });

    if (raceFinished && winner) {
      stopRaceAnimation();
      const finalPositions = currentRace.value.horses
        .map((progHorse) => {
          const position = horsePositions.value[progHorse.horseId] || 0;
          const horse = allHorses.value.find((h) => h.id === progHorse.horseId);
          return {
            horseId: progHorse.horseId,
            name: progHorse.name,
            position: position,
            condition: horse?.condition || 50,
          };
        })
        .sort((a, b) => b.position - a.position)
        .map((horse, index) => ({
          ...horse,
          finalPosition: index + 1,
        }));

      store.dispatch("races/finishCurrentRace", finalPositions);
    } else {
      animationFrame.value = requestAnimationFrame(animate);
    }
  };

  animationFrame.value = requestAnimationFrame(animate);
}

function stopRaceAnimation() {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
    animationFrame.value = null;
  }
  if (raceInterval.value) {
    clearInterval(raceInterval.value);
    raceInterval.value = null;
  }

  soundManager.stopGallop();
}

let previousRaceId = null;

watch(
  [racing, currentRace],
  ([newRacing, newRace], [oldRacing, oldRace]) => {
    if (newRace && newRace.raceNumber !== previousRaceId) {
      horsePositions.value = {};
      previousRaceId = newRace.raceNumber;
    }

    if (newRacing && newRace) {
      startRaceAnimation();
    } else {
      stopRaceAnimation();
    }
  },
  { immediate: true }
);

onMounted(() => {
  soundManager.init();
});

onUnmounted(() => {
  stopRaceAnimation();
  soundManager.stopAll();
});
</script>

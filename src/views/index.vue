<template>
  <div class="bg-gray-100 h-screen flex flex-col overflow-hidden">
    <div class="flex justify-between items-center p-4 bg-red-400 border-b border-gray-500 shrink-0">
      <h1 class="text-2xl font-bold">Horse Racing</h1>
      <div class="flex gap-4">
        <Button title="GENERATE PROGRAM" @click="generate" :loading="horsesLoading" />
        <Button title="START / PAUSE" @click="startRace" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 flex-1 overflow-hidden p-4">
      <div class="col-span-3 bg-white border border-gray-500 flex flex-col overflow-hidden">
        <h2 class="text-lg font-bold bg-yellow-300 p-2 shrink-0">Horse List (1-20)</h2>
        <div class="flex-1 overflow-y-auto overflow-x-auto">
          <Table :columns="horseColumns" :rows="horses">
            <template #color="{ row }">
              <div class="flex justify-center items-center gap-2">
                <span
                  class="w-4 h-4 rounded-full border border-gray-500"
                  :style="{ backgroundColor: row.color }"
                ></span>
                <span class="text-xs text-gray-600">
                  {{ row.color }}
                </span>
              </div>
            </template>
          </Table>
        </div>
      </div>
      <div class="col-span-5 flex flex-col overflow-hidden">
        <Race />
      </div>
      <div class="col-span-4 flex overflow-hidden">
        <div class="w-1/2 bg-white border border-gray-500 flex flex-col overflow-hidden">
          <h2 class="text-lg font-bold bg-blue-400 text-center py-2 shrink-0">Program</h2>
          <div class="flex-1 overflow-y-auto divide-y divide-gray-300">
            <div v-for="race in program" :key="race.raceNumber">
              <h3 class="bg-red-400 text-sm text-center py-1">{{ race.raceNumber }}ST Lap – {{ race.distance }}m</h3>
              <Table :columns="programAndResultsColumns" :rows="race.horses" />
            </div>
          </div>
        </div>
        <div class="w-1/2 bg-white border border-gray-500 flex flex-col overflow-hidden">
          <h2 class="text-lg font-bold bg-green-400 text-center py-2 shrink-0">Results</h2>
          <div class="flex-1 overflow-y-auto divide-y divide-gray-300">
            <div v-for="result in results" :key="result.raceNumber">
              <h3 class="bg-red-400 text-sm text-center py-1">
                {{ result.raceNumber }}ST Lap – {{ result.distance }}m
              </h3>
              <Table :columns="resultsColumns" :rows="result.winners" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Table from "@/components/TableComponent.vue";
import Race from "@/components/Race.vue";
import Button from "@/components/ui/Button.vue";

const store = useStore();

const horses = computed(() => store.getters["horses/horses"]);
const program = computed(() => store.getters["races/program"]);
const results = computed(() => store.getters["races/results"]);

const horsesLoading = computed(() => store.getters["horses/loading"]);

const horseColumns = [
  { key: "name", label: "Name" },
  { key: "condition", label: "Condition" },
  { key: "color", label: "Color", slot: "color" },
];
const programAndResultsColumns = [
  { key: "position", label: "Position" },
  { key: "name", label: "Name" },
];
const resultsColumns = [
  { key: "position", label: "Position" },
  { key: "name", label: "Name" },
];

const generate = async () => {
  await store.dispatch("horses/generateHorses");
  store.dispatch("races/generateProgram");
};

const startRace = () => {
  store.dispatch("races/toggleRace");
};
</script>

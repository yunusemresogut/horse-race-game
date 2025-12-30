<template>
  <div class="overflow-y-auto">
    <table class="w-full border border-gray-300 table-auto">
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="hover:bg-gray-50 transition">
          <td v-for="col in columns" :key="col.key" class="border border-gray-300 px-4 py-2 text-center">
            <slot v-if="col.slot" :name="col.slot" :row="row" />
            <span v-else>
              {{ row[col.key] }}
            </span>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td :colspan="columns.length" class="text-center py-6 text-gray-400">No data available. <br> Click on the generate button to generate data.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
});
</script>

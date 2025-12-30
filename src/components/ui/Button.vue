<template>
  <button
    class="bg-gray-100 px-4 py-2 border border-gray-500 font-semibold cursor-pointer hover:bg-gray-200 transition-colors duration-300"
    :disabled="loading"
    :loading="loading"
    :class="{ 'opacity-50 cursor-not-allowed': loading }"
  >
    <span v-if="loading">Loading...</span> <span v-else>{{ title }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

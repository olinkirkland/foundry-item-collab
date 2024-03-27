<template>
  <div v-if="item" class="item-panel">
    <h2>Selected Item: {{ item.name }}</h2>
    <div class="wrap-row">
      <p class="badge" :class="'badge--' + item.type">
        {{ item.type }}
      </p>
    </div>
    <div class="description" v-html="description"></div>
    <button @click="showJSON = !showJSON">
      {{ showJSON ? 'Hide' : 'Show' }} JSON
    </button>
    <pre v-if="showJSON" class="json">{{ item }}</pre>
  </div>
  <div v-else class="item-panel">
    <p>Select an item to view details.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { cleanFoundryDescription } from '../util';

const props = defineProps({
  item: {
    type: Object,
    required: false
  }
});

const showJSON = ref(false);

const description = computed(() => {
  if (!props.item) return null;
  return cleanFoundryDescription(props.item.system.description.value);
});
</script>

<style lang="scss" scoped>
.item-panel {
  padding: 1.2rem;
  height: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

:deep(.description em) {
  color: var(--primary-3);
  text-decoration: underline;
}
</style>

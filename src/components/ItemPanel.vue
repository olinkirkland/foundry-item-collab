<template>
  <div class="item-panel" v-if="item">
    <h2>Selected Item: {{ item.name }}</h2>
    <div class="wrap-row">
      <p class="badge" :class="'badge--' + item.type">
        {{ item.type }}
      </p>
    </div>
    <div class="description" v-html="description"></div>
    <pre>{{ item }}</pre>
  </div>
  <div v-else>
    <p>Select an item to view details.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cleanFoundryDescription } from '../util';

const props = defineProps({
  item: {
    type: Object,
    required: false
  }
});

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

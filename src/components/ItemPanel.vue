<template>
  <div class="item-panel">
    <h2>Selected Item: {{ item.name }}</h2>
    <div class="wrap-row">
      <p class="badge" :class="'badge--' + item.type">
        {{ item.type }}
      </p>
    </div>
    <div class="description" v-html="description"></div>
    <pre>{{ item }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cleanFoundryDescription } from '../util';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const description = computed(() => {
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

// deep em in the description
:deep(.description em) {
  color: var(--primary-3);
}
</style>

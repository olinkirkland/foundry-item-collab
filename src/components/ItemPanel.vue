<template>
  <div class="item-panel">
    <h2>Selected Item: {{ item.name }}</h2>
    <div class="wrap-row">
      <p class="badge" :class="'badge--' + item.type">
        {{ item.type }}
      </p>
    </div>
    <pre>{{ item }}</pre>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

if (false) console.log(props.item);
</script>

<style lang="scss" scoped>
.item-panel {
  padding: 1.2rem;
  height: 100%;
  border: 1px solid black;
  overflow: auto;

  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
</style>

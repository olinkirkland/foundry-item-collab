<template>
  <div class="item-card">
    <h2>{{ item.name }}</h2>
    <div class="wrap-row">
      <p class="badge">level {{ item.system.level.value }}</p>
      <p class="badge" :class="'badge--' + item.type">
        {{ item.type }}
      </p>
    </div>
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
.item-card {
  padding: 1.2rem;
  border-radius: 5px;
  box-shadow: var(--shadow-close);
  background-color: var(--surface-0);
  overflow: hidden;

  h2 {
    margin-bottom: 0.4rem;
    max-width: 24rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

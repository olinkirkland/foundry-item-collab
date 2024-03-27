<template>
  <div class="item-card">
    <header class="item-card__header">
      <h2>{{ item.name }}</h2>
      <p v-if="price">${{ price.toFixed(2) }}</p>
    </header>
    <div class="wrap-row">
      <p class="badge">level {{ item.system.level.value }}</p>
      <p class="badge" :class="'badge--' + item.type">
        {{ item.type }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const price = computed(() => {
  const itemPrice = props.item.system.price.value;
  // { pp: 0, gp: 0, sp: 0, cp: 0 }
  // Add them up where pp = 10, gp = 1, sp = 0.1, cp = 0.01
  let total = 0;
  if (itemPrice.pp) total += itemPrice.pp * 10;
  if (itemPrice.gp) total += itemPrice.gp;
  if (itemPrice.sp) total += itemPrice.sp / 10;
  if (itemPrice.cp) total += itemPrice.cp / 100;
  return total;
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

.item-card__header {
  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <div class="item-card">
    <header class="item-card__header">
      <h2>{{ item.name }}</h2>
      <p v-if="flattenedPrice" class="price">
        <span class="muted"
          >${{ flattenedPrice.toFixed(2) }} x {{ quantity.toFixed(0) }} = </span
        >${{ (flattenedPrice * quantity).toFixed(2) }}
      </p>
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

const flattenedPrice = computed(() => {
  const itemPrice = props.item.system.price.value;
  // { pp: 0, gp: 0, sp: 0, cp: 0 }
  // Add them up where pp = 10, gp = 1, sp = 0.1, cp = 0.01
  let flat = 0;
  if (itemPrice.pp) flat += itemPrice.pp * 10;
  if (itemPrice.gp) flat += itemPrice.gp;
  if (itemPrice.sp) flat += itemPrice.sp / 10;
  if (itemPrice.cp) flat += itemPrice.cp / 100;
  return flat;
});

const quantity = computed(() => {
  return props.item.system.quantity || 0;
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
  gap: 0.8rem;
}

.price {
  white-space: nowrap;
}
</style>

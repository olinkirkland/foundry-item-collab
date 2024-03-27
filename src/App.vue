<template>
  <div class="app">
    <header>
      <h1>{{ tiuri.name }}'s {{ items.length }} items</h1>
    </header>
    <div class="container">
      <ul class="items-list">
        <li v-for="item in items" :key="item.name">
          <item-card
            :item="item"
            @click="selectedItem = item"
            :class="{ selected: item._id === selectedItem._id }"
          />
        </li>
      </ul>
      <item-panel :item="selectedItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ItemCard from './components/ItemCard.vue';
import ItemPanel from './components/ItemPanel.vue';
import tiuri from './data/tiuri.json';

const excludeTypes = [
  'ancestry',
  'heritage',
  'background',
  'class',
  'feat',
  'lore',
  'action'
];

const items = computed(() => {
  return tiuri.items.filter((item) => {
    return !excludeTypes.includes(item.type);
  });
});

const selectedItem = ref(items.value[0]);
</script>

<style lang="scss" scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  padding: 1.2rem;
  > h1 {
    font-size: 4rem;
    text-align: center;
    border-bottom: 1px solid var(--surface-3);
  }
}

.container {
  padding: 1.2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  height: 100%;
  overflow: hidden;

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(36rem, 1fr));
    gap: 1.2rem;
    height: min-content;
    max-height: 100%;
    overflow: auto;

    > li {
      height: 100%;
      .item-card {
        cursor: pointer;
        &.selected {
          box-shadow: none;
          opacity: 0.5;
          pointer-events: none;
        }
      }
    }
  }
}
</style>

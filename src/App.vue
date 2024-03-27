<template>
  <div class="app">
    <header>
      <h1>{{ tiuri.name }}'s {{ items.length }} items</h1>
    </header>

    <div class="sort-options">
      <button @click="onClickSort('name')">
        <i
          v-if="sortMode.by === 'name'"
          :class="
            sortMode.order === 'asc'
              ? 'fas fa-sort-alpha-down'
              : 'fas fa-sort-alpha-up'
          "
        ></i>
        Sort by Name
      </button>
      <button @click="onClickSort('level')">
        <i
          v-if="sortMode.by === 'level'"
          :class="
            sortMode.order === 'asc'
              ? 'fas fa-sort-numeric-down'
              : 'fas fa-sort-numeric-up'
          "
        ></i>
        Sort by Level
      </button>
      <button @click="onClickSort('type')">
        <i
          v-if="sortMode.by === 'type'"
          :class="
            sortMode.order === 'asc'
              ? 'fas fa-sort-alpha-down'
              : 'fas fa-sort-alpha-up'
          "
        ></i>
        Sort by Type
      </button>
      <button @click="onClickSort('price')">
        <i
          v-if="sortMode.by === 'price'"
          :class="
            sortMode.order === 'asc'
              ? 'fas fa-sort-numeric-down'
              : 'fas fa-sort-numeric-up'
          "
        ></i>
        Sort by Price
      </button>
    </div>

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
import { flattenPrice } from './util';

const excludeTypes = [
  'ancestry',
  'heritage',
  'background',
  'class',
  'feat',
  'lore',
  'action'
];

const sortMode = ref({ by: 'name', order: 'asc' });

const items = computed(() => {
  return tiuri.items
    .filter((item) => {
      return !excludeTypes.includes(item.type);
    })
    .sort((a: any, b: any) => {
      switch (sortMode.value.by) {
        case 'name':
          return sortMode.value.order === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'level':
          return sortMode.value.order === 'asc'
            ? a.system.level.value - b.system.level.value
            : b.system.level.value - a.system.level.value;
        case 'type':
          return sortMode.value.order === 'asc'
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        case 'price':
          const flatPriceA = flattenPrice(a.system.price.value);
          const flatPriceB = flattenPrice(b.system.price.value);
          const totalA = flatPriceA * (a.system.quantity || 0);
          const totalB = flatPriceB * (b.system.quantity || 0);
          return sortMode.value.order === 'asc'
            ? totalA - totalB
            : totalB - totalA;
        default:
          return 0;
      }
    });
});

function onClickSort(by: string) {
  if (sortMode.value.by === by) {
    sortMode.value.order = sortMode.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sortMode.value.by = by;
    sortMode.value.order = 'asc';
  }
}

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
          opacity: 0.6;
          pointer-events: none;
        }
      }
    }
  }
}

.sort-options {
  padding: 1.2rem;
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}
</style>

<template>
  <div class="app">
    <header>
      <section class="controls">
        <button @click="importJSON">Import JSON</button>
        <button :class="{ disabled: !data }" @click="exportCSV">
          Export CSV
        </button>
      </section>
      <h1 v-if="data">{{ data.name }}'s {{ items.length }} items</h1>
      <h1 v-else>
        No data. Import a Foundry Character JSON file to get started.
      </h1>
    </header>

    <div class="sort-options" v-if="items.length">
      <section>
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
      </section>
      <section>
        <p>
          Inventory Value: <strong>${{ inventoryValue }}</strong>
        </p>
        <!-- <p>For Sale Value: ${{ saleValue }}</p> -->
      </section>
    </div>

    <div class="container" v-if="items.length">
      <ul class="items-list">
        <li v-for="item in items" :key="item.name">
          <item-card
            :item="item"
            @click="selectedItem = item"
            :class="{ selected: selectedItem && item._id === selectedItem._id }"
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
import { flattenPrice } from './util';

const data = ref(null as any);
const jsonFromLocalStorage = localStorage.getItem('foundryData');
if (jsonFromLocalStorage) data.value = JSON.parse(jsonFromLocalStorage);

function importJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      data.value = JSON.parse(e.target?.result as string);
      localStorage.setItem('foundryData', JSON.stringify(data.value));
    };
    reader.readAsText(file);
  };

  input.click();
}

function exportCSV() {
  const csvHeader = 'Name,Type,Level,Price,Quantity,Total Value\n';
  const csvData = items.value
    .map((item: any) => {
      return `${item.name},${item.type},${
        item.system.level.value
      },${flattenPrice(item.system.price.value)},${item.system.quantity || 0},${
        flattenPrice(item.system.price.value) * (item.system.quantity || 0)
      }`;
    })
    .join('\n');
  const csv = csvHeader + csvData;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventory.csv';
  a.click();
  URL.revokeObjectURL(url);
}

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
  if (!data.value) return [];
  return data.value.items
    .filter((item: any) => {
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

const inventoryValue = computed(() => {
  const allItemValues = items.value.map((item: any) => {
    const flatPrice = flattenPrice(item.system.price.value);
    return flatPrice * (item.system.quantity || 0);
  });
  let total = 0;
  for (const value of allItemValues) {
    total += value;
    total = Math.round((total + value) * 100) / 100;
  }
  return total;
});

function onClickSort(by: string) {
  if (sortMode.value.by === by) {
    sortMode.value.order = sortMode.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sortMode.value.by = by;
    sortMode.value.order = 'asc';
  }
}

const selectedItem = ref(null as any);
</script>

<style lang="scss" scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  padding: 1.2rem;
  > section.controls {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
  > h1 {
    font-size: 4rem;
    text-align: center;
  }
  border-bottom: 1px solid var(--surface-3);
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
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;

  > section {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
  }
}
</style>

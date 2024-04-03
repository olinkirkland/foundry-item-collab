<template>
  <div class="layout" v-if="!initiallyLoading">
    <!-- Choose user -->
    <div class="container container--center" v-if="!me">
      <panel>
        <h1>Who are you?</h1>
        <div class="users">
          <div v-if="users.length">
            <ul class="users-list">
              <li v-for="user in users" :key="user._id">
                <button @click="setUserById(user._id)">
                  <i v-if="user.isGM" class="fas fa-crown"></i>
                  {{ user.name }}{{ user.isGM ? ' (GM)' : '' }}
                </button>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>No users found.</p>
          </div>
        </div>
      </panel>
    </div>

    <!-- GM only-->
    <div class="container" v-if="me?.isGM">
      <panel class="gm-dashboard">
        <div class="row">
          <h1>GM Dashboard</h1>
          <div class="file-list">
            <div v-for="user in users.filter((u) => !u.isGM)" :key="user._id">
              <i class="fas fa-check"></i>
              <p>{{ user.name }}</p>
            </div>
          </div>
        </div>
        <div class="manage-data">
          <div class="controls">
            <button @click="onClickUploadFoundryFile">
              <i class="fas fa-upload"></i>
              Upload Foundry Character File (*.json)
            </button>
            <div class="row">
              <button @click="onClickDownloadCSV">
                <i class="fas fa-file-csv"></i>
                Download CSV
              </button>
              <button
                @click="onClickEraseAllData"
                :style="{
                  backgroundColor: 'var(--grey)',
                  color: 'var(--dark)',
                  marginLeft: 'auto'
                }"
              >
                <i class="fas fa-trash"></i>
                Erase All Data
              </button>
              <button
                @click="onClickMerge"
                :style="{
                  backgroundColor: 'var(--grey)',
                  color: 'var(--dark)'
                }"
              >
                <i class="fas fa-compress-alt"></i>
                Merge All
              </button>
            </div>
          </div>
        </div>
      </panel>
    </div>

    <!-- All users -->
    <div class="container container--collection" v-if="me">
      <div class="row wrap">
        <div class="row" style="height: 4rem">
          <button @click="fetchItems">
            <i class="fas fa-sync"></i>
          </button>
          <p>{{ sortedAndFilteredItems.length }}/{{ items.length }} Items</p>
          <p class="muted">|</p>
          <p>
            Owned Items:&nbsp;
            <i class="fas fa-coins"></i>
            {{ totalValue }}
          </p>
          <p class="muted">|</p>
          <p>
            For Sale:&nbsp;
            <i class="fas fa-coins"></i>
            {{ totalSaleValue }}
          </p>
        </div>
        <div class="row sort-by">
          <button
            @click="sort('name')"
            :class="sortBy.key === 'name' ? 'active' : ''"
          >
            <i
              :class="`fas fa-sort-alpha-${
                sortBy.key === 'name' && sortBy.order === 'asc' ? 'down' : 'up'
              }`"
            ></i>
            Name
          </button>
          <button
            @click="sort('price')"
            :class="sortBy.key === 'price' ? 'active' : ''"
          >
            <i
              :class="`fas fa-sort-numeric-${
                sortBy.key === 'price' && sortBy.order === 'asc' ? 'down' : 'up'
              }`"
            ></i>
            Price
          </button>
          <button
            @click="sort('level')"
            :class="sortBy.key === 'level' ? 'active' : ''"
          >
            <i
              :class="`fas fa-sort-numeric-${
                sortBy.key === 'level' && sortBy.order === 'asc' ? 'down' : 'up'
              }`"
            ></i>
            Level
          </button>
          <p class="muted">|</p>
          <button
            v-if="!me?.isGM"
            @click="showOnlyMyOwnedItems = !showOnlyMyOwnedItems"
          >
            {{
              showOnlyMyOwnedItems
                ? `Show All (${items.length})`
                : `Show Only my Items (${
                    items.filter((i) => i.owner == me?.name).length
                  })`
            }}
          </button>
          <button v-else @click="showOnlyItemsForSale = !showOnlyItemsForSale">
            {{
              showOnlyItemsForSale
                ? `Show All (${items.length})`
                : `Show Only Items for Sale (${
                    items.filter((i) => !i.owner).length
                  })`
            }}
          </button>
          <p class="muted">|</p>
          <button @click="me = null">Change User</button>
        </div>
      </div>
      <ul class="items-list">
        <li v-for="item in sortedAndFilteredItems" :key="item.id">
          <panel :class="{ 'for-sale': !item.owner }">
            <p v-if="item.level > 0" class="level">Level {{ item.level }}</p>
            <header>
              <h2>
                <span class="name">{{ item.name }}</span>
                <div>
                  <span class="muted" v-if="item.quantity > 1">
                    ({{ item.quantity }}x
                    <i class="fas fa-coins"></i>
                    {{ item.price }})&nbsp;
                  </span>
                  <i class="fas fa-coins"></i>
                  <span>{{
                    Math.round(item.price * item.quantity * 100) / 100
                  }}</span>
                </div>
              </h2>
            </header>
            <div class="attributes">
              <div v-if="item.owner">
                <p>{{ item.owner }}</p>
              </div>
              <div v-else>
                <p>For Sale</p>
              </div>
              <div>
                <p>
                  <span v-if="item.quantity > 1" class="muted">
                    ({{ item.quantity }}x
                    <i class="fas fa-weight-hanging"></i>
                    {{ item.bulk }})&nbsp;
                  </span>
                  <i class="fas fa-weight-hanging"></i>
                  {{ Math.round(item.bulk * item.quantity * 100) / 100 }}
                </p>
              </div>
            </div>
            <div v-if="me.isGM" class="item-controls">
              <button
                class="split"
                :class="{ disabled: item.quantity < 2 }"
                @click="onClickSplit(item)"
                :style="{
                  backgroundColor: 'var(--grey)',
                  color: 'var(--dark)'
                }"
              >
                <i class="fas fa-cut"></i>
              </button>
              <button
                class="sell"
                @click="giveItem(item.id, null)"
                :class="{ active: !item.owner }"
              >
                <i class="fas fa-coins"></i>
                Sell
              </button>
              <button
                v-for="user in users.filter((u) => !u.isGM)"
                :class="{ active: item.owner === user.name }"
                :key="user._id"
                @click="giveItem(item.id, user.name)"
              >
                <i class="fas fa-mitten"></i>
                {{ user.name }}
              </button>
            </div>
            <div v-else class="item-controls">
              <button
                @click="onClickSplit(item)"
                class="split"
                :class="{ disabled: item.quantity < 2 }"
                :style="{
                  backgroundColor: 'var(--grey)',
                  color: 'var(--dark)'
                }"
              >
                <i class="fas fa-cut"></i>
              </button>
              <button
                :class="{ sell: item.owner }"
                @click="giveItem(item.id, item.owner ? null : me.name)"
              >
                <i :class="item.owner ? 'fas fa-coins' : 'fas fa-mitten'"></i>
                {{ item.owner ? 'Sell' : 'Claim' }}
              </button>
            </div>
          </panel>
        </li>
      </ul>
    </div>
  </div>
  <modal-container />
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, ref } from 'vue';
import { ModalController } from './controllers/modal-controller';
import ConfirmModal from './modals/ConfirmModal.vue';
import InfoModal from './modals/InfoModal.vue';
import LoadingModal from './modals/LoadingModal.vue';
import ModalContainer from './modals/ModalContainer.vue';
import SplitItemModal from './modals/SplitItemModal.vue';
import { Item, User } from './types';
import wait from './wait';

// If running on localhost, use the local server
axios.defaults.baseURL =
  location.hostname === 'localhost'
    ? 'http://localhost:3005'
    : 'https://foundry-item-collab-server-production.up.railway.app/';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const initiallyLoading = ref(true);
// After 0.2s, set initiallyLoading to false
setTimeout(() => (initiallyLoading.value = false), 200);

const users = ref([] as User[]);
const items = ref([] as Item[]);
const me = ref(null as User | null);
const showOnlyMyOwnedItems = ref(false);
const showOnlyItemsForSale = ref(false);
const sortedAndFilteredItems = computed(() => {
  return items.value
    .sort((a, b) => {
      const { key, order } = sortBy.value;
      switch (key) {
        case 'name':
          if (a.name === b.name) return a.id.localeCompare(b.id);
          return order === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'price':
          if (a.price === b.price) return a.id.localeCompare(b.id);
          return order === 'asc' ? a.price - b.price : b.price - a.price;
        case 'level':
          if (a.level === b.level) return a.id.localeCompare(b.id);
          return order === 'asc' ? a.level - b.level : b.level - a.level;
        default:
          return 0;
      }
    })
    .filter((item) =>
      !me?.value?.isGM && showOnlyMyOwnedItems.value
        ? item.owner === me.value?.name
        : true
    )
    .filter((item) =>
      me?.value?.isGM && showOnlyItemsForSale.value ? !item.owner : true
    );
});

const sortBy = ref({
  key: 'name' as string,
  order: 'asc' as 'asc' | 'desc'
});

function sort(key: string) {
  if (sortBy.value.key === key) {
    sortBy.value.order = sortBy.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value.key = key;
    sortBy.value.order = 'asc';
  }
}

(async () => {
  await fetchData();
  const storedUserId = localStorage.getItem('user-id');
  if (storedUserId) setUserById(storedUserId);
})();

function setUserById(id: string) {
  me.value = users.value.find((user) => user._id === id) || null;
  localStorage.setItem('user-id', id);
}

async function fetchData() {
  await wait();
  ModalController.open(LoadingModal);
  await wait();
  await Promise.all([fetchUsers(), fetchItems()]);
  ModalController.close();
}

async function fetchUsers() {
  const { data } = await axios.get<User[]>('/users');
  users.value = data;
}

async function fetchItems() {
  const { data } = await axios.get<Item[]>('/items');
  items.value = data;
}

async function giveItem(itemId: string, userId: string | null) {
  const item = await axios.put(`/items/${itemId}/owner`, { owner: userId });
  const index = items.value.findIndex((i) => i.id === itemId);
  items.value[index] = item.data;
}

function onClickUploadFoundryFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    ModalController.open(LoadingModal);
    const fileData = await file.text();
    const minifiedFileData = JSON.stringify(JSON.parse(fileData));
    try {
      await axios.post('/upload', minifiedFileData, {
        headers: { 'Content-Type': 'application/json' }
      });
      fetchData();
    } catch (error) {
      console.error(error);
      // ModalController.close();
    }
  };
  input.click();
}

function onClickDownloadCSV() {
  // Item Name, Owner, Type, Price, Quantity, Total Price
  const tableHeader = [
    'Item Name',
    'Owner',
    'Type',
    'Bulk',
    'Price',
    'Quantity',
    'Total Price'
  ].join(',');
  const tableBody = items.value
    .map(
      (item) =>
        `${item.name},${item.owner},${item.type},${item.bulk},${item.price},${
          item.quantity
        },${item.price * item.quantity}`
    )
    .join('\n');

  const csv = `${tableHeader}\n${tableBody}`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob([csv], { type: 'text/csv;charset=utf-8' })
  );
  a.download = 'items.csv';
  a.click();
}

async function onClickEraseAllData() {
  ModalController.open(ConfirmModal, {
    prompt: 'Are you sure you want to erase ALL the data?',
    onConfirm: async () => {
      ModalController.open(LoadingModal);
      await axios.delete('/erase');
      fetchData();
    }
  });
}

const totalValue = computed(() => {
  let total = 0;
  items.value.forEach((item) => {
    if (item.owner)
      total = Math.round((total + item.price * item.quantity) * 100) / 100;
  });
  return total;
});

const totalSaleValue = computed(() => {
  let total = 0;
  items.value.forEach((item) => {
    if (!item.owner)
      total = Math.round((total + item.price * item.quantity) * 100) / 100;
  });
  return total;
});

function onClickSplit(item: Item) {
  ModalController.open(SplitItemModal, { item, onClose: fetchData });
}

function onClickMerge() {
  ModalController.open(ConfirmModal, {
    prompt:
      'Are you sure you want to merge all items with the same belonging to the same owner?',
    onConfirm: async () => {
      ModalController.open(LoadingModal);
      const mergeSummary: {
        name: string;
        owner: string;
        quantity: number;
      }[] = (await axios.post('/merge')).data;
      const mergeSummaryHTML =
        mergeSummary.length > 0
          ? mergeSummary
              .map(
                (item) =>
                  `• ${item.owner}'s <span class="primary">${item.name}</span> (x${item.quantity})`
              )
              .join('<br />')
          : 'No items were merged.';
      await fetchData();
      wait();
      ModalController.open(InfoModal, {
        title: 'Merge Summary',
        message: mergeSummaryHTML
      });
    }
  });
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.2rem;
  height: 100vh;
  width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  &--center {
    height: 100%;
    justify-content: center;
    align-items: center;
  }
}

.file-list {
  display: flex;
  flex: 1;
  gap: 2rem;
  justify-content: flex-end;

  > div {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    opacity: 0.6;
  }
}

.manage-data {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  .row {
    width: 100%;
  }

  .controls {
    display: flex;
    gap: 0.8rem;

    > button:first-child {
      white-space: nowrap;
    }
  }

  .panel {
    align-items: center;
    i {
      font-size: 2.4rem;
    }
  }
}

.users ul {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

ul.items-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 1.2rem;

  > li {
    position: relative;
    header {
      display: flex;

      > h2 {
        display: flex;
        width: 100%;
        > span {
          white-space: nowrap;
        }

        > span.name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        > div {
          display: flex;
          gap: 0.4rem;
        }
      }
    }

    .attributes {
      display: flex;
      gap: 0.4rem;
      width: 100%;
      justify-content: space-between;

      > div {
        display: flex;
        gap: 0.4rem;
      }
    }
  }
}

.sort-by {
  margin-left: auto;
}

.level {
  position: absolute;
  padding: 0.3rem 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  top: -0.6rem;
  left: -0.6rem;
  border-radius: 5px;
  background-color: var(--dark);
  color: var(--light);
}

.panel.for-sale {
  background-color: var(--yellow);
}

.item-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  > button {
    min-width: 40%;
    flex: 1;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > button.split {
    width: fit-content;
    min-width: 4rem;
    flex: 0;
  }

  > button.sell {
    flex: 1;
    background-color: var(--yellow);
    color: var(--dark);
    // minimum width fit the whole row size
    min-width: 60%;
  }
}

.container--collection {
  > .row {
    justify-content: center;
  }

  > .row.wrap {
    justify-content: space-between;
  }

  .sort-by {
    margin-left: unset;
  }
}
</style>

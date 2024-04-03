<template>
  <panel class="modal">
    <h2>
      Split {{ item.owner ? item.owner + "'s " : '' }} {{ item.quantity }}
      <span class="primary">{{ props.item.name }}</span> into two items.
    </h2>
    <div class="controls">
      <button @click="onClickMoveQuantity(-5)">
        <i class="fas fa-angle-double-left"></i>
        5
      </button>
      <button @click="onClickMoveQuantity(-1)">
        <i class="fas fa-angle-left"></i>
        1
      </button>
      <h2>{{ quantityA }} ({{ quantityB }})</h2>
      <button @click="onClickMoveQuantity(1)">
        <i class="fas fa-angle-right"></i>
        1
      </button>
      <button @click="onClickMoveQuantity(5)">
        <i class="fas fa-angle-double-right"></i>
        5
      </button>
    </div>

    <div class="row">
      <button
        @click="onClickSplit"
        :style="{
          backgroundColor: 'var(--grey)',
          color: 'var(--dark)'
        }"
        :class="{ disabled: quantityA === 0 || quantityB === 0 }"
      >
        Split {{ quantityA }} ({{ quantityB }})
      </button>
      <button @click="ModalController.close()">Cancel</button>
    </div>
  </panel>
</template>

<script setup lang="ts">
import axios from 'axios';
import { PropType, ref } from 'vue';
import { ModalController } from '../controllers/modal-controller';
import { Item } from '../types';
import LoadingModal from './LoadingModal.vue';
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  onClose: {
    type: Function as PropType<() => void>,
    required: false
  }
});

const quantityA = ref(props.item.quantity);
const quantityB = ref(0);

function onClickSplit() {
  ModalController.open(LoadingModal);
  axios
    .post(`/items/${props.item.id}/split`, {
      quantityA: quantityA.value,
      quantityB: quantityB.value
    })
    .then(() => {
      props.onClose?.();
      ModalController.close();
    })
    .catch((error) => {
      console.error(error);
      ModalController.close();
    });
}

function onClickMoveQuantity(amount: number) {
  console.log('onClickMoveQuantity', amount);
  quantityA.value -= amount;
  quantityB.value += amount;

  if (quantityA.value < 0) {
    quantityB.value += quantityA.value;
    quantityA.value = 0;
  } else if (quantityB.value < 0) {
    quantityA.value += quantityB.value;
    quantityB.value = 0;
  }
}
</script>

<style scoped lang="scss">
.modal {
  width: 64rem;
}
.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  > button {
    flex: 1;
    justify-content: center;
  }
}
</style>

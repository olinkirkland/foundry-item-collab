<template>
  <panel class="modal">
    <h2>{{ prompt }}</h2>
    <div class="row">
      <button
        @click="onClickConfirm"
        :style="{
          backgroundColor: 'var(--grey)',
          color: 'var(--dark)'
        }"
      >
        Confirm
      </button>
      <button @click="onClickClose">Cancel</button>
    </div>
  </panel>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ModalController } from '../controllers/modal-controller';
const props = defineProps({
  prompt: {
    type: String,
    required: true
  },
  onConfirm: {
    type: Function as PropType<() => void>,
    required: true
  },
  onClose: {
    type: Function as PropType<() => void>,
    required: false
  }
});

async function onClickConfirm() {
  props.onConfirm();
}

function onClickClose() {
  props.onClose?.();
  ModalController.close();
}
</script>

<style scoped lang="scss"></style>

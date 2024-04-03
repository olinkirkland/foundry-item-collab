<template>
  <panel class="modal">
    <h2>{{ title }}</h2>
    <p v-html="message"></p>
    <div class="row">
      <button @click="onClickClose">Ok</button>
    </div>
  </panel>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ModalController } from '../controllers/modal-controller';
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  onClose: {
    type: Function as PropType<() => void>,
    required: false
  }
});

function onClickClose() {
  props.onClose?.();
  ModalController.close();
}
</script>

<style scoped lang="scss">
.modal {
  min-width: 32rem;
}
</style>

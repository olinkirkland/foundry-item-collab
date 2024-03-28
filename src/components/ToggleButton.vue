<template>
  <label class="toggle-button">
    <input
      :id="id"
      type="checkbox"
      :checked="props.value"
      @change="$emit('update:modelValue', !props.value)"
    />
    <i class="fas fa-toggle-on" v-if="props.value"></i>
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
const id = `toggle-button-${Math.random().toString(36).slice(2)}`;

const props = defineProps<{
  value: boolean;
  modelValue: boolean;
  'onUpdate:modelValue': (value: boolean) => void;
}>();
</script>

<style scoped lang="scss">
.toggle-button {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

input {
}
</style>

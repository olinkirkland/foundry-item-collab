<template>
  <div class="panel">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  background-color: var(--light);
  border: 0.2rem solid var(--dark);
  border-bottom: 0.4rem solid var(--dark);
  border-radius: 5px;
  padding: 1.2rem;
}
</style>

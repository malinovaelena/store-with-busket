<script setup>
import Items from "@/components/Items.vue";
import Busket from "@/components/Busket.vue";
</script>

<template>
  <div class="wrapper">
    <Items />
    <Busket />
  </div>
</template>

<style>
.wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
